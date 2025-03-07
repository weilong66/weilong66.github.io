import os
import sys
import json
import msvcrt


def dir_to_dict(path, depth=0):
    d = {'name': os.path.basename(path), 'type': 'folder', 'children': []}
    if not os.path.exists(path):
       return False
    
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
        elif os.path.isfile(full_path) and child.endswith('.html'):  # 只处理HTML文件
            d['children'].append({'name': child, 'icon': '', 'type': 'file'})
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
    print(f"\n-----开始识别【根目录/yxmb】目录及子目录结构，将在【./link】目录下生成对应的HTML文件：") #输出提示信息
    all_games = []
    for category in data['children']:
        if not category['children']:
            print(f"{data['name']}\\{category['name']} 目录为空，已跳过")
            continue
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
            if game['type'] == 'games':
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
            elif game['type'] == 'file':
                href = f"../link/{game['name']}"
                img_text = game['name']
                
                html_content += f"""
                    <div class="item">
                        <a target="right" href="{href}" title="">
                            <div>
                                <div class="logo">
                                    <img src="" alt="Coding">{img_text}
                                </div>
                                <div class="desc"></div>
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

        print(f"{output_html_file_path}")

    # Generate the combined HTML page
    generate_combined_html(all_games)
    tree['children'].insert(0,{'name': '全部游戏', 'type': 'folder', 'children':'all_folder'})

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

    print(f"创建总页面： {output_html_file_path}")

def extract_files_for_json(tree):
    files_list = []

    for category in tree['children']:
        if category['type'] == 'folder':
            files_list.append({
                "name": category['name'] + '.html',# 添加 .html 后缀
                "icon": "",
                "type": category['type']
            })
    return files_list

def remove_empty_children(tree):
    if 'children' in tree:
        tree['children'] = [remove_empty_children(child) for child in tree['children'] if 'children' in child and child['children']]
    return tree

def write_tree_to_json(tree, output_file):
    print(f"\n-----开始根据HTML文件创建JSON文件") #输出提示信息
    
    # 提取文件信息
    files_list = extract_files_for_json(tree)
    # 确保输出文件所在的目录存在，如果不存在则创建
    os.makedirs(os.path.dirname(output_file), exist_ok=True)
    
    relative_path = os.path.relpath(output_file, start=script_dir) #通过指定根路径来提取相对路径
    with open(output_file, 'w', encoding='utf-8') as f:  # 打开输出文件，指定编码为utf-8
        json.dump(files_list, f, ensure_ascii=False, indent=4)  # 将文件列表写入JSON文件，支持中文字符，缩进4个空格
    print(f"{relative_path}")
    print(f"-----JSON文件生成完成\n")


# 获取当前脚本的目录
def get_base_path():
    if getattr(sys, 'frozen', False):
        # 如果是通过PyInstaller等工具打包成的exe，sys.executable会指向该exe文件的路径
        return os.path.dirname(os.path.abspath(sys.executable))
    else:
        # 在常规Python环境中运行时，__file__变量存在且有效
        return os.path.dirname(os.path.abspath(__file__))
        

# 获取脚本所在目录
script_dir = get_base_path()

print(f"开始运行脚本，根目录为： {script_dir} ")

# 确保获取到的script_dir不是None
if script_dir is None:
    raise ValueError("无法确定脚本目录，请检查运行环境或脚本配置")

# 设置根目录为脚本所在目录下的yxmb目录
root_directory = os.path.join(script_dir, 'yxmb')

#print(f"Root directory: {root_directory}")  # 调试打印

# 获取目录结构字典
tree = dir_to_dict(root_directory)
if not tree:
    print("脚本所在目录下未找到yxmb文件夹 或 yxmb文件夹为空，脚本运行结束！")
    sys.exit(1)

# 生成HTML页面
generate_html_from_dict(tree)

print(f"-----HTML页面生成完成\n")

# 设置输出文件为脚本所在目录下的data子目录中的file.json
output_json_file = os.path.join(script_dir, 'data', 'websitePath_New.json')


# 生成JSON文件
write_tree_to_json(remove_empty_children(tree), output_json_file)

print(f"\n脚本运行结束，按任意键退出...\n")
msvcrt.getch()



