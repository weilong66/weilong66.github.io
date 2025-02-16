// 定义您的API密钥
const apiKey = window.hugoConfig.qWeather.key;

// config.toml配置项中的地区名称（支持文字、以英文逗号分隔的"经度,纬度"坐标）(文字最小可以到市辖区)
const locationName = window.hugoConfig.qWeather.locationName;

//config.toml配置项中的城市的上级行政区划（可设定只在某个行政区划范围内进行搜索，用于排除重名城市或对结果进行过滤）
const admName = window.hugoConfig.qWeather.admName;

//天气插件请求开关
let weatherEnable = true;

//定义天气和城市数据
let weatherData;
let locationData;

// 缓存键前缀
const cacheKeyPrefix = "weatherCache_";

// 构建配置项城市缓存键
const initialCacheKey = `${cacheKeyPrefix}_${locationName}_${admName || ""}`;

//缓存过期时间（从hugo配置文件获取）
const cacheExp = window.hugoConfig.qWeather.cacheExp;

// 获取当前时间戳
const now = Date.now();


//获取客户端地理位置以便获取对应城市天气数据
getLocationAndFetchWeather(apiKey, locationName, admName);


function checkCacheDate(cachedData) {
    // 检查缓存是否存在，且未过期，且上次响应码为200
    if (cachedData && cachedData.expiry > now && cachedData.code == 200) {
        // 使用缓存数据
        weatherData = cachedData.weatherData;
        locationData = cachedData.locationData;
        displayWeatherInfo();
        console.log("缓存中找到未过期的天气数据，天气插件将使用缓存数据。");
        return true;
    } else if (cachedData && cachedData.expiry > now && cachedData.code != 200) {
        console.log(
            "上次天气请求错误，请等待5分钟后重试，上次错误信息：\n" +
            JSON.stringify(cachedData.error)
        );
    } else {
        return false;
    }
}

//获取地理位置
function getLocationAndFetchWeather(key, defaultLocation, adm) {
    if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const longitude = Math.trunc(position.coords.longitude * 100000) / 1000; //经度(只保留小数点后四位)
                const latitude = Math.trunc(position.coords.latitude * 100000) / 1000; //纬度(只保留小数点后四位)
                const geoCacheKey = `${cacheKeyPrefix}_${longitude},${latitude}`; //构建经纬度缓存键
                const cachedGeoData = JSON.parse(localStorage.getItem(geoCacheKey)); //获取客户端地理位置的天气缓存
                //可以输出经纬度以检查：console.log("经纬度：" + longitude + "," + latitude)
                //检查经纬度缓存是否存在且有效
                const geoCacheDateUsable = checkCacheDate(cachedGeoData);
                if (!geoCacheDateUsable) {
                    console.log("使用'位置信息'成功查询到所在城市.");
                    getWeatherDate(key, `${longitude},${latitude}`, adm, geoCacheKey);
                }
            },
            (error) => {
                console.warn("无法获取地理位置:", error.message);
                /* 如果获取客户端地理位置失败，则使用配置项的城市天气缓存或使用配置项的locationName重新请求城市天气*/
                // 检查配置项的城市天气缓存是否存在且有效
                const cachedData = JSON.parse(localStorage.getItem(initialCacheKey));
                const cacheDateUsable = checkCacheDate(cachedData);
                if (!cacheDateUsable) {
                    console.log("将使用默认城市.");
                    // 如果缓存不可用，使用配置项的locationName请求天气数据
                    getWeatherDate(key, defaultLocation, adm, initialCacheKey);
                }

            }, {
                timeout: 3000, // 设置超时时间为5秒
                maximumAge: 180 * 1000 // 使用缓存数据，如果数据不超过3分钟
            }
        );
    } else {
        console.warn("此浏览器不支持地理定位(使用默认城市).");
        /* 如果浏览器不支持地理定位，则使用配置项的城市天气缓存或使用配置项的locationName重新请求城市天气*/
        // 检查配置项的城市天气缓存是否存在且有效
        const cachedData = JSON.parse(localStorage.getItem(initialCacheKey));
        const cacheDateUsable = checkCacheDate(cachedData);
        if (!cacheDateUsable) {
            console.log("将使用默认城市.");
            // 如果缓存不可用，使用配置项的locationName请求天气数据
            getWeatherDate(key, defaultLocation, adm, initialCacheKey);
        }
    }
}

function getWeatherDate(key, location, adm, cacheKey) {
    
    // 构建请求URL以查找城市信息
    let lookupUrl = `https://geoapi.qweather.com/v2/city/lookup?location=${location}`;
    //如果adm存在则拼接
    if (adm) {
        lookupUrl += `&adm=${encodeURIComponent(adm)}`;
    }
    //如果apiKey存在则拼接，不存在则关闭天气插件
    if (key) {
        lookupUrl += `&key=${key}`;
    } else {
        console.log("天气插件请求失败，因为天气插件的API KEY为空！");
        weatherEnable = false;
    }

    //根据weatherEnable判断是否请求天气数据
    if (weatherEnable) {
        // 发送GET请求以查找城市信息
        fetch(lookupUrl)
            .then((response) => {
                if (!response.ok) {
                    // 创建一个更详细的错误信息，包括状态码和可能的JSON响应体
                    return response.json().then((errData) => {
                        //设置冷却时间5分钟
                        const expiryTime = now + 5 * 60 * 1000; // 错误冷却时间（单位：分钟）
                        //将异常信息存入缓存
                        localStorage.setItem(
                            cacheKey,
                            JSON.stringify({
                                error: errData.error,
                                expiry: expiryTime,
                            })
                        );
                        throw new Error(
                            `城市数据请求失败: ${response.status} ${response.statusText}. 服务器错误详细信息: ${errData.error.detail}`
                        );
                    });
                }
                return response.json(); // 将响应体解析为JSON
            })
            .then((data) => {
                // 假设我们只关心第一个匹配的城市
                locationData = data.location[0];

                // 使用找到的城市ID构建天气查询的请求URL
                const weatherUrl = `https://devapi.qweather.com/v7/weather/now?location=${locationData.id}&key=${apiKey}`;

                // 发送GET请求以获取天气信息
                return fetch(weatherUrl);
            })
            .then((response) => {
                if (!response.ok) {
                    // 创建一个更详细的错误信息，包括状态码和可能的JSON响应体
                    return response.json().then((errData) => {
                        //设置冷却时间5分钟
                        const expiryTime = now + 5 * 60 * 1000; // 错误冷却时间（单位：分钟）
                        //将异常信息存入缓存
                        localStorage.setItem(
                            cacheKey,
                            JSON.stringify({
                                error: errData.error,
                                expiry: expiryTime,
                            })
                        );
                        throw new Error(
                            `天气数据请求失败: ${response.status} ${response.statusText}. 服务器错误详细信息: ${errData.error.detail}`
                        );
                    });
                }
                return response.json(); // 将响应体解析为JSON
            })
            .then((data) => {
                // 存储数据到 localStorage
                const expiryTime = now + 5 * 60 * 1000; // 缓存有效期（单位：分钟）
                //将成功获取的数据储存到缓存
                localStorage.setItem(
                    cacheKey,
                    JSON.stringify({
                        weatherData: data.now,
                        locationData: locationData,
                        expiry: expiryTime,
                        code: data.code,
                    })
                );

                // 更新全局变量
                weatherData = data.now;
                locationData = locationData;

                // 显示天气信息
                displayWeatherInfo();
            })
            .catch((error) => {
                // 捕获并处理任何发生的错误
                console.error("请求过程中出现错误:\n", error);
                //输出错误数据和间隔时间，避免无意义请求
                const expiryTime = now + 5 * 60 * 1000; // 设置5分钟缓存有效期
            });
    }
}

// 显示天气信息的函数
function displayWeatherInfo() {
    // 获取容器元素
    const container = document.getElementById("he-plugin-simple");

    // 创建并插入天气信息
    if (weatherData) {
        //html标签；
        //注意：此处借用标题栏的悬浮窗功能实现，而标题栏的悬浮窗字体颜色等样式必须使用a标签才能生效。
        container.innerHTML = `
        <ul class="navbar-nav site-menu" style="margin-right: 16px;">
            <li class="weather-details">
                <a>
                    <span>
                    ${formatIsoDate(weatherData.obsTime,"yyyy年MM月dd日")}&nbsp;|&nbsp;${locationData.name}&nbsp;|&nbsp;${weatherData.temp}°C&nbsp;
                    ${weatherData.text}<i class="qi-${weatherData.icon}-fill ${getWeatherColorClass(weatherData.icon)}"></i>
                    </span>
                </a>
                <ul class="sub-menu">
                    <li><strong>区县: </strong>${locationData.name}</li>
                    <li><strong>ID: </strong>${locationData.id}</li>
                    <li><strong>纬度: </strong>${locationData.lat}</li>
                    <li><strong>经度: </strong>${locationData.lon}</li>
                    <li><strong>城市: </strong>${locationData.adm2}</li>
                    <li><strong>省份: </strong>${locationData.adm1}</li>
                    <li><strong>国家: </strong>${locationData.country}</li>
                    <li><strong>时区: </strong>${locationData.tz}</li>
                    
                    <li><strong>天气:</strong> ${weatherData.text} <i class="qi-${weatherData.icon}-fill ${getWeatherColorClass(weatherData.icon)}"></i></li>
                    <li><strong>温度:</strong> ${weatherData.temp}&nbsp;°C</li>
                    <li><strong>体感温度:</strong> ${weatherData.feelsLike}&nbsp;°C</li>
                    <li><strong>风向:</strong> ${weatherData.windDir}</li>
                    <li><strong>风力:</strong> ${weatherData.windScale}&nbsp;级</li>
                    <li><strong>风速:</strong> ${ weatherData.windSpeed}&nbsp;km/h</li>
                    <li><strong>湿度:</strong> ${weatherData.humidity}&nbsp;%</li>
                    <li><strong>过去降水量:</strong> ${weatherData.precip}&nbsp;mm</li>
                    <li><strong>大气压强:</strong> ${weatherData.pressure}&nbsp;hPa</li>
                    <li><strong>能见度:</strong> ${weatherData.vis}&nbsp;km</li>
                    <li><strong>云量:</strong> ${weatherData.cloud}&nbsp;%</li>
                    <li><strong>露点温度:</strong> ${weatherData.dew}&nbsp;°C</li>
                </ul>
            </li>
        </ul>
    `;
    } else {
        container.innerHTML = '<div class="weather-item">无法获取天气信息</div>';
    }
}

//格式化时间函数
function formatIsoDate(isoString, targetFormat = "yyyy-MM-dd HH:mm") {
    // 创建一个新的 Date 对象
    const date = new Date(isoString);

    // 检查日期是否有效
    if (isNaN(date.getTime())) {
        return "Invalid Date";
    }

    // 定义格式化方法
    function pad(value) {
        return String(value).padStart(2, "0");
    }

    // 根据提供的目标格式返回相应的字符串
    return targetFormat
        .replace("yyyy", date.getFullYear())
        .replace("MM", pad(date.getMonth() + 1))
        .replace("dd", pad(date.getDate()))
        .replace("HH", pad(date.getHours()))
        .replace("mm", pad(date.getMinutes()));
}

// 辅助函数：根据icon值返回相应的CSS类名
function getWeatherColorClass(icon) {
    if (icon >= 100 && icon <= 153) {
        return "hefeng-sunny";
    } else if (icon >= 300 && icon <= 399) {
        return "hefeng-rain";
    } else if (icon >= 400 && icon <= 499) {
        return "hefeng-snow";
    } else {
        return "hefeng-other";
    }
}

function getGeolocation() {
    if ("geolocation" in navigator) {
        // 浏览器支持Geolocation API
        navigator.geolocation.getCurrentPosition(
            function(position) {
                getWeatherDate(
                    apiKey,
                    position.coords.longitude + "," + position.coords.latitude
                );
            },
            function(error) {
                // 处理错误
                console.error("获取地理位置失败(将使用默认城市):", error.message);
                //失败则使用配置中的默认城市作为天气数据来源城市
                getWeatherDate(apiKey, locationName, admName);
            }
        );
    } else {
        // 浏览器不支持Geolocation API
        console.error("您的浏览器不支持地理位置服务，将使用默认地理位置配置项。");
        //失败则使用配置中的默认城市作为天气数据来源城市
        getWeatherDate(apiKey, locationName, admName);
    }
}

// 辅助函数：根据icon值返回相应的CSS类名
function getWeatherColorClass(iconCode) {
    switch (iconCode) {
        case "100": // 晴天-白天
        case "150": // 晴天-夜晚
            return "weather-sunny";
        case "101": // 多云-白天
        case "102": // 少云-白天
        case "103": // 晴间多云-白天
        case "151": // 多云-夜晚
        case "152": // 少云-夜晚
        case "153": // 晴间多云-夜晚
            return "weather-cloudy";
        case "104": // 阴天
            return "weather-overcast";
        case "300": //阵雨
        case "301": //强阵雨
        case "305": //小雨
        case "306": //中雨
        case "307": //大雨
        case "309": //毛毛雨/细雨
        case "313": //冻雨
        case "314": //小到中雨
        case "315": //中到大雨
        case "350": //阵雨
        case "351": //强阵雨
        case "399": //雨
            return "weather-rain";
        case "302": //雷阵雨
        case "303": //强雷阵雨
        case "304": //雷阵雨伴有冰雹
        case "308": //极端降雨
        case "310": //暴雨
        case "311": //大暴雨
        case "312": //特大暴雨
        case "316": //大到暴雨
        case "317": //暴雨到大暴雨
        case "318": //大暴雨到特大暴雨
        case "403": //暴雪
        case "410": //大到暴雪
            return "weather-thunderstorm";
        case "400": //小雪
        case "401": //中雪
        case "402": //大雪
        case "404": //雨夹雪
        case "405": //雨雪天气
        case "406": //阵雨夹雪
        case "407": //阵雪
        case "408": //小到中雪
        case "409": //中到大雪
        case "456": //阵雨夹雪
        case "457": //阵雪
        case "499": //雪
            return "weather-snow";
        case "500": //薄雾
        case "501": //雾
        case "502": //霾
        case "509": //浓雾
        case "510": //强浓雾
        case "511": //中度霾
        case "512": //重度霾
        case "513": //严重霾
        case "514": //大雾
        case "515": //特强浓雾
            return "weather-fog";
        case "503": //扬沙
        case "504": //浮尘
        case "507": //沙尘暴
        case "508": //强沙尘暴
            return "weather-sand";
        default:
            console.log("未知的天气图标代码");
            return "";
    }
}