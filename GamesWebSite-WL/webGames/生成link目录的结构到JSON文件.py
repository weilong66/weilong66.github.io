import os
import json

def dir_to_dict(path):
    d = {'name': os.path.basename(path), 'type': 'folder', 'children': []}
    for child in sorted(os.listdir(path)):  # 获取并排序所有子项
        full_path = os.path.join(path, child)  # 构建完整路径
        if os.path.isfile(full_path) and child.endswith('.html'):  # 只处理HTML文件
            d['children'].append({'name': child, 'icon':'', 'type': 'file'})
    return d  # 返回构建的目录结构字典

def write_tree_to_json(root_dir, output_file):
    # 确保输出文件所在的目录存在，如果不存在则创建
    os.makedirs(os.path.dirname(output_file), exist_ok=True)
    
    tree = dir_to_dict(root_dir)  # 获取目录结构字典
    with open(output_file, 'w', encoding='utf-8') as f:  # 打开输出文件，指定编码为utf-8
        json.dump(tree['children'], f, ensure_ascii=False, indent=4)  # 将子目录列表写入JSON文件，支持中文字符，缩进4个空格

# 获取脚本所在目录
script_dir = os.path.dirname(os.path.abspath(__file__))

# 设置根目录为脚本所在目录下的link目录
root_directory = os.path.join(script_dir, 'link')

# 设置输出文件为脚本所在目录下的data子目录中的file.json
output_json_file = os.path.join(script_dir, 'data', 'websitePath_New.json')

write_tree_to_json(root_directory, output_json_file)  # 调用函数生成JSON文件



