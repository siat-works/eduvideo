import os
import json
import pandas as pd

processed_dir = 'processedData/'
pretest_dir = 'preTest/'
test_dir = 'test/'
posttest_dir = 'postTest/'
video_dir = 'videoLog/'
processed_data_dir = [processed_dir + pretest_dir, processed_dir + test_dir, processed_dir + posttest_dir,
                      processed_dir + video_dir]


def preprocess(dir):
    file_list = os.listdir(dir)
    data_w = []
    for file in file_list:
        file_name = file.replace('.txt', '')
        file_path = dir + file
        f = open(file_path, 'r+', encoding='utf8');
        data = json.load(f)
        data_w.append(data)
    return data_w, file_name


def preprocess_data():  # 存放处理后数据的文件夹

    # 创建处理后preTest数据的存放文件夹
    if not os.path.exists(processed_dir + pretest_dir):
        os.makedirs(processed_dir + pretest_dir)
    # 处理preTest数据
    data, file_name = preprocess(pretest_dir)
    dict = pd.DataFrame(data, columns=['choice[]', 'video'])
    dict = dict.rename(columns={'video': '视频类型', 'choice[]': '课前选择'})
    file_path = processed_dir + pretest_dir + file_name + '.csv'
    dict.to_csv(file_path, index=False, encoding='utf8')

    # 创建处理后postTest数据的存放文件夹
    if not os.path.exists(processed_dir + posttest_dir):
        os.makedirs(processed_dir + posttest_dir)
    # 处理postTest数据
    data, file_name = preprocess(posttest_dir)
    post_dict = pd.DataFrame(data, columns=['choice[]', 'gender', 'age', 'major', 'level'])
    post_dict = post_dict.rename(
        columns={'choice[]': '课后调查选择', 'gender': '志愿者性别', 'age': '志愿者年龄', 'major': '志愿者专业', 'level': '志愿者年级',
                 })
    file_path = processed_dir + posttest_dir + file_name + '.csv'
    post_dict.to_csv(file_path, index=False, encoding='utf8')

    # 创建处理后preTest数据的存放文件夹
    if not os.path.exists(processed_dir + test_dir):
        os.makedirs(processed_dir + test_dir)
    # 处理preTest数据
    data, file_name = preprocess(test_dir)
    test_dict = pd.DataFrame(data, columns=['choice[]', 'text[]', 'code', 'score'])
    test_dict = test_dict.rename(
        columns={'choice[]': '选择题答案', 'text[]': '简答题答案', 'code': '编程题答案', 'score': '选择题分数',
                 })
    file_path = processed_dir + test_dir + file_name + '.csv'
    test_dict.to_csv(file_path, index=False, encoding='utf8')

    # 创建处理后videoLog数据的存放文件夹
    if not os.path.exists(processed_dir + video_dir):
        os.makedirs(processed_dir + video_dir)
    # 处理videoLog数据
    data, file_name = preprocess(video_dir)
    video_dict = pd.DataFrame(data,
                              columns=['before_pause_num', 'before_left_num', 'before_right_num', 'before_useful_time',
                                       'before_real_time', 'after_pause_num', 'after_left_num', 'after_right_num',
                                       'after_useful_time', 'after_real_time', 'total_pause_num', 'total_left_num',
                                       'total_right_num', 'total_useful_time', 'total_real_time'])
    video_dict = video_dict.rename(
        columns={'before_pause_num': '测试前暂停次数', 'before_left_num': '测试前快退次数', 'before_right_num': '测试前快进次数',
                 'before_useful_time': '测试前有效观看时长', 'before_real_time': '测试前页面停留时长',
                 'after_pause_num': '测试后暂停次数', 'after_left_num': '测试后快退次数', 'after_right_num': '测试后快进次数',
                 'after_useful_time': '测试后有效观看时长', 'after_real_time': '测试后页面停留时长',
                 'total_pause_num': '总暂停次数', 'total_left_num': '总快退次数', 'total_right_num': '总快进次数',
                 'total_useful_time': '总有效观看时长', 'total_real_time': '总页面停留时长'})
    file_path = processed_dir + video_dir + file_name + '.csv'
    video_dict.to_csv(file_path, index=False, encoding='utf8')


pass

preprocess_data()
path_list = os.listdir(processed_dir)
for path in path_list:
    if os.path.isfile(processed_dir + path):
        file = open(processed_dir + path, 'r+', encoding='utf8')
        first_line = file.readline().replace('\n', '')+','
        for dir in processed_data_dir:
            file_list = os.listdir(dir)
            for data_file_name in file_list:
                data_file = open(dir + data_file_name, 'r+', encoding='utf8')
                first_line += data_file.readline().replace('\n', '')+','
                break
        first_line=first_line+'\n'
        output_file = open('processed_data.csv', 'w+', encoding='utf8')
        output_file.write(first_line)
        break
for path in path_list:
    if os.path.isfile(processed_dir + path):
        user_file = open(processed_dir + path, 'r+', encoding='utf8')
        user_line = user_file.readline()
        user_line = user_file.readline().replace('\n', '')
        user_line = user_line + ','
        while not user_line == ',':
            line = ''
            line=line+user_line
            phone = user_line.split(',')[0]
            for dir in processed_data_dir:
                file_list = os.listdir(dir)
                for data_file_name in file_list:
                    phone_ = data_file_name.split('_')[0]
                    if phone == phone_:
                        data_file = open(dir + data_file_name, 'r+', encoding='utf8')
                        data_line = data_file.readline()
                        data_line = data_file.readline().replace('\n', '')
                        data_line = data_line + ','
                        line = line + data_line
                        break
            line = line + '\n'
            output_file = open('processed_data.csv', 'a+', encoding='utf8')
            output_file.write(line)
            output_file.close()
            user_line = user_file.readline().replace('\n','')
            user_line=user_line+','
            pass
