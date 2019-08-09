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
dict=pd.DataFrame(data,columns=['id','name','gender','phone','videoid'])
dict=dict.rename(columns={'name':'姓名','gender':'性别','phone':'联系方式','videoid': '视频类型'})
dict.to_excel('preData.xlsx',index=False)

posttest_dir='postTest/'
data=preprocess(posttest_dir)
post_dict=pd.DataFrame(data,columns=['id','phone','choice[]','teacher_gender','test_num','learned','grades','gender','age','nation','address','major','level','video'])
post_dict.rename(columns={'phone':'联系方式','choice[]':'评分','teacher_gender':'认为老师性别','test_num': '实验编号','learned': '是否学过编程','grades':'编程课程分数','gender': '性别','age': '年龄','nation': '民族','address': '地址','major': '专业','level':'年级','video': '视频类型'})
post_dict.to_excel('postData.xlsx',index=False)

test_dir='test/'
data=preprocess(test_dir)
test_dict=pd.DataFrame(data,columns=['id','phone','choice[]','text[]','code','score','video'])
test_dict.rename(columns={'phone': '联系方式','choice[]': '选择题答案','text[]': '简答题答案','code': '编程题答案','score' :'选择题分数','video': '视频类型'})
test_dict.to_excel('testData.xlsx',index=False)

video_dir='videoLog/'
data=preprocess(video_dir)
video_dict=pd.DataFrame(data[0],columns=['id','cur_Time','cur_action','skip_time'])
video_dict.rename(columns={'cur_Time': '动作发生时间','cur_action': '动作类型','skip_time': '动作跳过时间'})
video_dict.to_excel('videoLogData.xlsx',index=False)
pass