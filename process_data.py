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
    dict = pd.DataFrame(data, columns=['video', 'pre_questionnaire_choice0', 'pre_questionnaire_choice1',
                                       'pre_questionnaire_choice2', 'pre_questionnaire_choice3',
                                       'pre_questionnaire_choice4'])
    dict = dict.rename(columns={'video': 'video_class'})
    file_path = processed_dir + pretest_dir + file_name + '.csv'
    dict.to_csv(file_path, index=False, encoding='gbk')

    # 创建处理后postTest数据的存放文件夹
    if not os.path.exists(processed_dir + posttest_dir):
        os.makedirs(processed_dir + posttest_dir)
    # 处理postTest数据
    data, file_name = preprocess(posttest_dir)
    post_dict = pd.DataFrame(data, columns=['choice0', 'choice1', 'choice2', 'choice3', 'choice4', 'choice5', 'choice6',
                                            'choice7', 'choice8', 'gender', 'age', 'major', 'level'])
    post_dict = post_dict.rename(
        columns={'choice0': 'post_questionnaire_choice0', 'choice1': 'post_questionnaire_choice1', 'choice2': 'post_questionnaire_choice2', 'choice3': 'post_questionnaire_choice3',
                 'choice4': 'post_questionnaire_choice4', 'choice5': 'post_questionnaire_choice5', 'choice6': 'post_questionnaire_choice6', 'choice7': 'post_questionnaire_choice7',
                 'choice8': 'post_questionnaire_choice8'})
    file_path = processed_dir + posttest_dir + file_name + '.csv'
    post_dict.to_csv(file_path, index=False, encoding='gbk')

    # 创建处理后preTest数据的存放文件夹
    if not os.path.exists(processed_dir + test_dir):
        os.makedirs(processed_dir + test_dir)
    # 处理preTest数据
    data, file_name = preprocess(test_dir)
    test_dict = pd.DataFrame(data, columns=['choice0', 'choice1', 'choice2', 'choice3', 'choice4', 'text0', 'text1','text2','code', 'score'])
    test_dict = test_dict.rename(
        columns={'text0': 'short_answer0', 'text1': 'short_answer1','text2': 'short_answer2','score': 'choices_scores',
                 })
    file_path = processed_dir + test_dir + file_name + '.csv'
    test_dict.to_csv(file_path, index=False, encoding='gbk')

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
        columns={'before_pause_num': 'pause_num_before_test', 'before_left_num': 'reverse_num_before_test',
                 'before_right_num': 'forward_num_before_test',
                 'before_useful_time': 'meaningful_time_before_test', 'before_real_time': 'reality_time_before_test',
                 'after_pause_num': 'pause_num_after_test', 'after_left_num': 'reverse_num_after_test',
                 'after_right_num': 'forward_num_after_test',
                 'after_useful_time': 'meaningful_time_after_test', 'after_real_time': 'reality_time_after_test'})
    file_path = processed_dir + video_dir + file_name + '.csv'
    video_dict.to_csv(file_path, index=False, encoding='gbk')


pass

preprocess_data()
path_list = os.listdir(processed_dir)
for path in path_list:
    if os.path.isfile(processed_dir + path):
        file = open(processed_dir + path, 'r+', encoding='gbk')
        first_line = file.readline().replace('\n', '') + ','
        for dir in processed_data_dir:
            file_list = os.listdir(dir)
            for data_file_name in file_list:
                data_file = open(dir + data_file_name, 'r+', encoding='gbk')
                first_line += data_file.readline().replace('\n', '') + ','
                break
        first_line = first_line + '\n'
        output_file = open('processed_data.csv', 'w+', encoding='gbk')
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
            line = line + user_line
            phone = user_line.split(',')[0]
            for dir in processed_data_dir:
                file_list = os.listdir(dir)
                for data_file_name in file_list:
                    phone_ = data_file_name.split('_')[0]
                    if phone == phone_:
                        data_file = open(dir + data_file_name, 'r+', encoding='gbk')
                        data_line = data_file.readline()
                        data_line = data_file.readline().replace('\n', '')
                        data_line = data_line + ','
                        line = line + data_line
                        break
            line = line + '\n'
            output_file = open('processed_data.csv', 'a+', encoding='gbk')
            output_file.write(line)
            output_file.close()
            user_line = user_file.readline().replace('\n', '')
            user_line = user_line + ','
            pass
