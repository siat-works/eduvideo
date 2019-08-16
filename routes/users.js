var express = require('express');
const mysql = require('mysql');
var fileupload=require('express-fileupload');
var csv=require('node-csv');
var db = require('../config/config');
var query = require('../config/sql_query');
var online_num = 0;
var connection;


function handleDisconnect() {
    connection = mysql.createConnection(db.mysql);
    connection.connect(function (err) {              // The server is either down
        if (err) {                                     // or restarting (takes a while sometimes).
            console.log('error when connecting to db:', err);
            setTimeout(handleDisconnect, 2000); // We introduce a delay before attempting to reconnect,
        }                                     // to avoid a hot loop, and to allow our node script to
    });                                     // process asynchronous requests in the meantime.
                                            // If you're also serving http, display a 503 error.
    connection.on('error', function (err) {
        console.log('db error', err);
        if (err.code === 'PROTOCOL_CONNECTION_LOST') { // Connection to the MySQL server is usually
            handleDisconnect();                         // lost due to either server restart, or a
        } else {                                      // connnection idle timeout (the wait_timeout
            throw err;                                  // server variable configures this)
        }
    });
}

handleDisconnect();

setInterval(function () {
    connection.query(query.user.query, function (err, result) {
        if (err)
            throw err;
        // else
        // console.log(result[0]);
    });
}, 10000);

var router = express.Router();

router.use(fileupload({
    useTempFiles: true,
    tempFileDir: '/temp/'
}));

/* GET users listing. */
router.get('/', function (req, res, next) {
    res.send('respond with a resource');
});


router.post('/video', function (req, res) {
    var params = req.body;
    console.log(params.online);
    if (params.online == 'true') {
        console.log('观看');
        online_num += 1;
    } else {
        console.log('离开');
        online_num -= 1;
    }
    var fs = require("fs");//申请文件处理var
    var now = new Date();
    var time = now.getFullYear() + '-' + (now.getMonth() + 1) + '-' + now.getDate() + ' ' + now.getHours() + ' : ' + now.getMinutes() + ' : ' + now.getSeconds();
    var line = time + ' people online: ' + online_num + '\n';
    var filepath = "onlineLog.log";//文件路径
    fs.appendFile(filepath, line, function (err) {
        if (err) {
            throw err;
        } else {
            console.log(online_num);
        }
    })
});

router.post('/login', function (req, res) {
    var params = req.body;

    /**
     * 登录时查询数据库信息
     */
    connection.query(query.user.selectByPhone, params.phone, function (err, result) {
        if (err)
            throw err;
        else {
            if (result.length == 0) {
                res.send({
                    status: 1,
                    msg: '未查询到您的手机号，请检查是否有误，有问题请与实验人员联系'
                });
                res.end();
            } else {
                let response = result[0];
                if (response.phone == params.phone) {
                    if (response.seq == 0) {
                        connection.query(query.user.selectMaxSeq, function (err, result) {
                            if (err) {
                                console.log("查最大值出错")
                                throw err;
                            } else {
                                let maxSeq = 0
                                if (result.length > 0) {
                                    console.log(result[0]);
                                    maxSeq = result[0].max;
                                    maxSeq += 1;
                                    var videoId = maxSeq % 2;
                                    connection.query(query.user.updateSeqVideo, [maxSeq, videoId, response.id], function (err, result) {
                                        if (err) {
                                            // throw err;
                                        } else {
                                            res.send({
                                                status: 0,
                                                msg: '登陆成功',
                                                id: response.id,
                                                videoId: videoId
                                            });
                                            res.end();
                                        }
                                    });
                                }
                            }
                        })
                    } else {
                        res.send({
                            status: 0,
                            msg: '登陆成功',
                            id: response.id,
                            videoId: response.videoId
                        });
                        res.end();
                    }
                } else {
                    res.send({
                        status: 2,
                        msg: "手机号有误"
                    });
                    res.end();
                }
            }
        }
    })
});

router.post('/admin', function (req, res) {
    var params = req.body;
    connection.query(query.user.selectByPhone, params.phone, function (err, result) {
        if (err)
            throw err;
        else {
            if (result.length > 0) {
                res.send({
                    status: 5,
                    msg: '手机号重复'
                });
                res.end();
            } else if (result.length == 0) {
                connection.query(query.user.insert, params.phone, function (err, result) {
                    if (err)
                        throw err;
                    else {
                        var response = result[0];
                        console.log(response);
                        res.send({
                            status: 0,
                            msg: '添加成功',
                        });
                        res.end();
                    }
                })
            }
        }
    })
});

router.post('/admin/table', function (req, res) {
    connection.query(query.user.query, function (err, result) {
        if (err) {
            throw err;
        } else {
            res.send({
                status: 0,
                msg: '查询完成',
                result: result
            });
            res.end();
        }
    })
});

router.post('/admin/delete', function (req, res) {
    var params = req.body;
    console.log(params);
    connection.query(query.user.delete, params.id, function (err, result) {
        if (err) {
            throw err;
        } else {
            res.send({
                status: 0,
                msg: "删除成功"
            });
            res.end();
        }
    })
});

router.post('/admin/search', function (req, res) {
    var params = req.body;
    connection.query(query.user.selectByPhone, params.phone, function (err, result) {
        if (err) {
            throw err;
        } else {
            if (result.length > 0) {
                res.send({
                    status: 0,
                    msg: '查询完成',
                    result: result
                });
                res.end();
            } else {
                res.send({
                    status: 5,
                    msg: '未查询到该记录',
                    result: result
                });
                res.end();
            }
        }
    })
});

router.post('/admin/uploadFile', function (req, res) {
    console.log(req.files);
    var file = req.files.files;
    var fs = require('fs');
    console.log(file.name);
    var parser=csv.createParser();
    parser.parseFile(file.tempFilePath,function (err,data) {
        if (err)
            throw err;
        else {
            for (var i=1;i<data.length;i++){
                // console.log(data[i]);
                var phone=data[i][0];
                var name =data[i][1];
                var note =data[i][2];
                connection.query(query.user.insertByAll,[phone,name,note],function (err,result) {
                    if (err) {
                        throw err;
                        return;
                    }
                    else {
                        console.log(data[i]+'插入成功')
                    }
                })
            }
            res.send({
                status: 0,
                msg: '插入成功'
            });
            res.end();
        }
    })
});

router.post('/preTest', function (req, res) {
    var params = req.body;
    console.log(params);
    // connection.query(query.user.update, [params.gender, params.id], function (err, result) {
    //     if (err) {
    //         throw err;
    //     } else {
    //         console.log("修改成功");
    //         /**
    //          * 插入相关项到数据库
    //          */
    //         connection.query(query.questionnarre.query, params.id, function (err, result) {
    //             if (err) {
    //                 throw err;
    //             } else {
    //                 if (result.length == 0) {
    //                     connection.query(query.questionnarre.insert, params.id, function (err, result) {
    //                         if (err) {
    //                             throw err;
    //                         } else {
    //                             console.log("插入questionnaire完成");
    //                         }
    //                     })
    //                 }
    //             }
    //         });
    //         var fs = require("fs");//申请文件处理
    //         var rawdata = JSON.stringify(params);
    //         var filepath = "preTest/" + params.phone + "_preTest.txt";//文件路径
    //         fs.writeFile(filepath, rawdata, function (err) {
    //             if (err) {
    //                 throw err;
    //             } else {
    //                 connection.query(query.questionnarre.updatePreTest, [filepath, params.id], function (err, result) {
    //                     if (err) {
    //                         throw err;
    //                     } else {
    //                         console.log('success');
    //                         res.send({
    //                             status: 0,
    //                             msg: 'test 上传成功',
    //                         });
    //                         res.end();
    //                     }
    //                 });
    //             }
    //         })
    //     }
    // });
    connection.query(query.user.update, [params.gender, params.id], function (err, result) {
        if (err) {
            throw err;
        } else {
            console.log("修改成功");
            /**
             * 插入相关项到数据库
             */
            connection.query(query.questionnarre.query, params.id, function (err, result) {
                if (err) {
                    throw err;
                } else {
                    if (result.length == 0) {
                        connection.query(query.questionnarre.insert, params.id, function (err, result) {
                            if (err) {
                                throw err;
                            } else {
                                console.log("插入questionnaire完成");
                            }
                        })
                    }
                }
            });
            var fs = require("fs");//申请文件处理
            var rawdata = JSON.stringify(params);
            var filepath = "preTest/" + params.phone + "_preTest.txt";//文件路径
            fs.writeFile(filepath, rawdata, function (err) {
                if (err) {
                    throw err;
                } else {
                    connection.query(query.questionnarre.updatePreTest, [filepath, params.id], function (err, result) {
                        if (err) {
                            throw err;
                        } else {
                            console.log('success');
                            res.send({
                                status: 0,
                                msg: 'test 上传成功',
                            });
                            res.end();
                        }
                    });
                }
            })
        }
    });
});

router.post('/test', function (req, res) {
    // console.log(res.body);
    var params = req.body;
    var fs = require("fs");//申请文件处理
    var rawdata = JSON.stringify(params);
    var filepath = "test/" + params.phone + "_test.txt";//文件路径
    fs.writeFile(filepath, rawdata, function (err) {//写入内容到txt文件
        if (err) {
            console.log(err);
        } else {
            connection.query(query.questionnarre.updateTest, [filepath, params.id], function (err, result) {
                if (err) {
                    console.log("updatetest error");
                    throw err;
                } else {
                    console.log('success');
                    res.send({
                        status: 0,
                        msg: 'test 上传成功'
                    });
                    res.end();
                }
            });
        }
    });
});


router.post('/postTest', function (req, res) {
    console.log(res.body);
    var params = req.body;
    connection.query(query.user.update, [params.gender, params.id], function (err, result) {
        if (err) {
            throw err;
        } else {
            console.log("修改成功");
        }
    });
    var fs = require("fs");//申请文件处理
    var rawdata = JSON.stringify(params);
    var filepath = "postTest/" + params.phone + "_postTest.txt";//文件路径
    fs.writeFile(filepath, rawdata, function (err) {//写入内容到txt文件
        if (err) {
            console.log(err);
        } else {
            connection.query(query.questionnarre.updatePostTest, [filepath, params.id], function (err, result) {
                if (err) {
                    console.log("updatetest error");
                    throw err;
                } else {
                    console.log('success');
                    res.send({
                        status: 0,
                        msg: 'test 上传成功'
                    });
                    res.end();
                }
            });
        }
    });
});
module.exports = router;
