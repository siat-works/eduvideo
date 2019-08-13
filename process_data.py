import os
import json
import pandas as pd

def preprocess(dir):
    file_list = os.listdir(dir)
    data_w = []
    for file in file_list:
        file_path = dir + file
        f = open(file_path, 'r+', encoding='utf8');
        data = json.load(f)
        data_w.append(data)
    return data_w


pretest_dir='preTest/'
data=preprocess(pretest_dir)
dict=pd.DataFrame(data,columns=['id','phone','choice[]','video'])
dict=dict.rename(columns={'phone':'联系方式','video': '视频类型','choice[]': '选择'})
dict.to_excel('preData.xlsx',index=False)

posttest_dir='postTest/'
data=preprocess(posttest_dir)
post_dict=pd.DataFrame(data,columns=['id','phone','choice[]','gender','age','major','level','video'])
post_dict=post_dict.rename(columns={'phone':'联系方式','choice[]':'评分','gender': '性别','age': '年龄','major': '专业','level':'年级','video': '视频类型'})
post_dict.to_excel('postData.xlsx',index=False)

test_dir='test/'
data=preprocess(test_dir)
test_dict=pd.DataFrame(data,columns=['id','phone','choice[]','text[]','code','score','video'])
test_dict=test_dict.rename(columns={'phone': '联系方式','choice[]': '选择题答案','text[]': '简答题答案','code': '编程题答案','score' :'选择题分数','video': '视频类型'})
test_dict.to_excel('testData.xlsx',index=False)

video_dir='videoLog/'
data=preprocess(video_dir)
video_dict=pd.DataFrame(data[0],columns=['id','date_time','cur_Time','cur_action','skip_time'])
video_dict=video_dict.rename(columns={'cur_Time': '动作发生时播放进度','cur_action': '动作类型','skip_time': '动作跳过时长','date_time': '发生时间'})
video_dict.to_excel('videoLogData.xlsx',index=False)
pass