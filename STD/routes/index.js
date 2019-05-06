var express = require('express');
var router = express.Router();
var sqlserver=require('mssql')
var fs = require("fs");
var formidable = require('formidable')
var md5=require('md5-node');
var key={
  
    server: "127.0.0.1",
    database: "test_student",
    user: "xiaoqianyi",
    password: "9527",
    port: 1433
}
sqlserver.close()

/
/* GET home page. */
router.get('/', function(req, res, next) {
    sqlserver.close()
  res.render('login', { title: 'fuck' });
    //res.send(caonimalegeb);
});
router.post('/teacher/student/pic',function(req,res,next)
{sqlserver.close()
    console.log('hhahaha')
  var form = new formidable.IncomingForm()
  form.parse(req)
  form.on('file', function(name, file) {
      console.log(file.path)  
      
})
form.on('fileBegin', function(name, file) {
    
    file.path=('C:/Users/feerie6/studentDatabase/public/images/studentpic'+'/'+req.cookies.coociek+'.jpg')
});;



}
  
)
router.get('/student',function(req,res,next)
{
    sqlserver.close()
    var b=req.query.account;
    console.log(typeof(b))
    
    var d=req.query.password
    console.log(d)
    var cookee=[b,d];
    var sql=`select * from student where studentnumber=${b} `
    sqlserver.connect(key).then(function () {
        
        
          var req = new sqlserver.Request().query(sql).then(function (b) {
            console.log((b.recordset[0]))
              if(d==md5(b.recordset[0].passwd))
              {
                  
                var p=b.recordset[0]
                res.cookie("cookee",cookee,{maxAge: 900000, httpOnly: true});
             
                res.render('student',p)
                sqlserver.close()
               
               
              }
              else
              {
                sqlserver.close();
                 res.send('has not found')
                
               
              }
          })
             
      })
        

})
router.get('/student/chengji',function(req,res,next)
{
    sqlserver.close()
   var cookie=req.cookies.cookee
   console.log(cookie)
   var sql=`SELECT SUST.subjectname , score,xuefen
   FROM dbo.SUST ,dbo.SUBJECT
   WHERE dbo.SUST.studentnumber='${cookie[0]}' AND SUST.subjectname=dbo.SUBJECT.subjectname`
   sqlserver.connect(key).then(function () {
    var req = new sqlserver.Request().query(sql).then(function (b) {
        console.log(b.recordset[0])
        
    
        res.render('chengji',{jilu:b.recordset})
    }
)
   })
        
   
})
router.get('/teacher',function(req,res,next)
{
    sqlserver.close()
    var b=req.query.account;
    console.log(typeof(b))
    
    var d=req.query.password
    console.log(d)
    var cookee=[b,d];
    var sql=`select * from teacher where teachernumber=${b} `
    sqlserver.connect(key).then(function () {
        
        
          var req = new sqlserver.Request().query(sql).then(function (b) {
              var subject=b.recordset[0].subjectnumber
           
              if(d==md5(b.recordset[0].psd))
              {
                  
                sqlserver.close()
                res.cookie("cookee",cookee,{maxAge: 900000, httpOnly: true});
                
                var SQL=`SELECT studentname , student.studentnumber , Class ,studentinstitute ,subjectname ,score
                FROM dbo.student ,dbo.SUST
                WHERE student.studentnumber=SUST.studentnumber AND subjectname='${subject}'
                ORDER BY score`
                    sqlserver.connect(key).then(function () {
                        var req = new sqlserver.Request().query(SQL).then(function (b)
                         {
                             console.log(b.recordset.length)
                                var gakki=b.recordset
                                res.render('teacher',{data:gakki})
                                sqlserver.close()
                        }
                    )
                
                
               
               
                
               
               
              })
            }
              else
              {
                sqlserver.close();
                 res.send('has not found')
                
               
              }
          })
             
      })
})

router.get('/teacher/student',function(req,res,next)
{
    sqlserver.close()
  var studentnumber=req.query.account
  console.log(studentnumber)
  var sql=`select * from student where studentnumber='${studentnumber}' `
  sqlserver.connect(key).then(function () {
  var req = new sqlserver.Request().query(sql).then(function (b) {
    
          
        var p=b.recordset[0]
        res.cookie("coociek",studentnumber,{maxAge: 900000, httpOnly: true});
     
        res.render('tstudent',p)
        sqlserver.close()
       
       
      
  }
      
  )
}
  )
}
)

router.get('/teacher/student/chengji',function(req,res,next)
{
    sqlserver.close()
   var studentnumber= req.cookies.coociek
   var sql=`SELECT SUST.subjectname , score,xuefen
   FROM dbo.SUST ,dbo.SUBJECT
   WHERE dbo.SUST.studentnumber='${studentnumber}' AND SUST.subjectname=dbo.SUBJECT.subjectname`
   sqlserver.connect(key).then(function () {
    var req = new sqlserver.Request().query(sql).then(function (b) {
        var p=b.recordset
        res.render('tchengji',{jilu:p})
        
        sqlserver.close()
}
   )
   }
   )
}
   )
router.post('/teacher/student/edit',function(req,res,next)
{
    sqlserver.close()
   var len=req.body.length
   console.log(len)
   console.log(req.body)
   var studentnumber= req.cookies.coociek
   console.log(req.cookies.coociek)
   console.log(studentnumber)
   var sql=''
   for(var i=0; i<len; i++)
   {
       console.log(i)
    sql=`UPDATE SUST
    SET score=${req.body[i][1]}
    WHERE studentnumber='${studentnumber}' and subjectname='${req.body[i][0]}'` +sql
    console.log(sql)
   }
  
        
   
   sqlserver.connect(key).then(function () {
     var req=new sqlserver.Request().query(sql).then(function (b) {
        
        console.log('shootyou')
        sqlserver.close()
    
    }
   ).catch(function(err){console.log(err)})
   }
   )
   
}


)

module.exports = router;
