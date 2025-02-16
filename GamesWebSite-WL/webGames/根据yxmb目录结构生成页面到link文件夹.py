import os

def dir_to_dict(path, depth=0):
    d = {'name': os.path.basename(path), 'type': 'type', 'children': []}
    for child in sorted(os.listdir(path)):  # 获取并排序所有子项
        full_path = os.path.join(path, child)  # 构建完整路径
        if os.path.isdir(full_path):  # 只处理子目录
            child_info = dir_to_dict(full_path, depth + 1)  # 递归调用获取子目录信息
            if depth < 1:  # 最多识别每个目录的子目录
                d['children'].append(child_info)  # 添加子目录信息
            else:
                # 如果是子子目录，只记录其名称、类型和图片路径
                game_name = os.path.basename(full_path)
                img_path = find_image_path(full_path, game_name)
                desc_text = read_desc_file(full_path)  # 读取描述文件
                d['children'].append({'name': game_name, 'type': 'games', 'desc': desc_text, 'img_path': img_path})  # 记录子子目录名称、类型、描述和图片路径
    return d  # 返回构建的目录结构字典

def find_image_path(game_dir, game_name):
    image_extensions = ['.jpg', '.jpeg', '.png', '.gif']  # 支持的图片格式
    for ext in image_extensions:
        img_path = os.path.join(game_dir, f"{game_name}{ext}")
        if os.path.exists(img_path):
            relative_path = os.path.relpath(img_path, start=os.path.dirname(game_dir)).replace('\\', '/')
            return f"../yxmb/{os.path.basename(os.path.dirname(game_dir))}/{relative_path}"
    return '../images/logo.png'  # 默认图片路径

def read_desc_file(game_dir):
    desc_file_path = os.path.join(game_dir, 'desc.txt')
    if os.path.exists(desc_file_path):
        with open(desc_file_path, 'r', encoding='utf-8') as file:
            return file.read().strip()
    return ''  # 如果没有找到描述文件，则返回空字符串

def generate_html_from_dict(data):
    all_games = []
    for category in data['children']:
        html_content = f"""
<!DOCTYPE HTML>
<html>
<head>
   <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">
    <link rel="stylesheet" href="../css/sptx.css">
    <link rel="stylesheet" href="../css/font-awesome-4.7.0/css/font-awesome.min.css">
<body>
    <section class="main">
        <div class="box">
    """

        for game in category.get('children', []):
            all_games.append((category['name'], game))  # 将类别名称和游戏添加到总列表中
            href = f"../yxmb/{category['name']}/{game['name']}/index.html"
            img_text = game['name']
            desc_text = game['desc']
            img_path = game.get('img_path', '../default.jpg')  # 默认图片路径
            
            html_content += f"""
                <div class="item">
                    <a target="right" href="{href}" title="{desc_text}">
                        <div>
                            <div class="logo">
                                <img src="{img_path}" alt="Coding">{img_text}
                            </div>
                            <div class="desc">{desc_text}</div>
                        </div>
                    </a>
                    <a class="togo" href="{href}" target="_blank" title="新页面打开"><i class="fa fa-chevron-right"></i></a>
                </div>
"""

        html_content += """
        </div>
    </section>
</body>
</html>
"""

        # 将生成的HTML内容写入文件
        output_html_file_name = f"{category['name']}.html"
        output_html_file_path = os.path.join('link', output_html_file_name)
        os.makedirs(os.path.dirname(output_html_file_path), exist_ok=True)
        with open(output_html_file_path, 'w', encoding='utf-8') as output_file:
            output_file.write(html_content)

        print(f"Generated HTML page saved to {output_html_file_path}")

    # Generate the combined HTML page
    generate_combined_html(all_games)

def generate_combined_html(games):
    html_content = f"""
<!DOCTYPE HTML>
<html>
<head>
   <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">
    <link rel="stylesheet" href="../css/sptx.css">
    <link rel="stylesheet" href="../css/font-awesome-4.7.0/css/font-awesome.min.css">
<body>
    <section class="main">
        <div class="box">
    """

    for category_name, game in games:
        href = f"../yxmb/{category_name}/{game['name']}/index.html"
        img_text = game['name']
        desc_text = game['desc']
        img_path = game.get('img_path', '../default.jpg')  # 默认图片路径
        
        html_content += f"""
            <div class="item">
                <a target="right" href="{href}" title="{desc_text}">
                    <div>
                        <div class="logo">
                            <img src="{img_path}" alt="Coding">{img_text}
                        </div>
                        <div class="desc">{desc_text}</div>
                    </div>
                </a>
                <a class="togo" href="{href}" target="_blank" title="新页面打开"><i class="fa fa-chevron-right"></i></a>
            </div>
"""

    html_content += """
        </div>
    </section>
</body>
</html>
"""

    # 将生成的HTML内容写入文件
    output_html_file_name = "全部游戏.html"
    output_html_file_path = os.path.join('link', output_html_file_name)
    os.makedirs(os.path.dirname(output_html_file_path), exist_ok=True)
    with open(output_html_file_path, 'w', encoding='utf-8') as output_file:
        output_file.write(html_content)

    print(f"Combined HTML page saved to {output_html_file_path}")

# 获取脚本所在目录
script_dir = os.path.dirname(os.path.abspath(__file__))

# 设置根目录为脚本所在目录下的yxmb目录
root_directory = os.path.join(script_dir, 'yxmb')

# 获取目录结构字典
tree = dir_to_dict(root_directory)

# 生成HTML页面
generate_html_from_dict(tree)



