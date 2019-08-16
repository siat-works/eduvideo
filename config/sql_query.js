let counter=0;
var user_query={
    insert:'insert into user(phone) VALUES (?)',
    delete:'delete from user where id = ?',
    selectByPhone:'select * from user where phone = ?',
    selectById: 'select * from user where id = ?',
    query: 'select * from user',
    selectByVideoId: 'select * from user where videoId = ?',
    update: 'update user set gender = ? where id = ?',
    updateSeqVideo: 'update user set seq = ? , videoId = ? where id = ?',
    selectMaxSeq: 'select max(seq) as max from user',
    insertByAll: 'insert into user(phone, name, notes) values (?,?,?)'
};

var videoLog_query={
    insert: 'insert into videolog(UserId,path) values(?,?)',
    delete: 'delete from videolog where UserId = ?',
    query: 'select path fron videolog where userId= ?',
};

var questionnarre_query={
    insert: 'insert into questionnaire(userId) values (?)',
    delete: 'delete from questionnaire where userId = ?',
    query: 'select * from questionnaire where userId = ?',
    updateTest: 'update questionnaire set test = ? where userId = ?',
    updatePreTest: 'update questionnaire set preTest = ? where userId = ?',
    updatePostTest: 'update questionnaire set postTest = ? where userId = ?'
};

module.exports={user:user_query,videoLog:videoLog_query,questionnarre:questionnarre_query};