# nodebb-plugin-bboj

与[BBOJ](https://github.com/azurity/bboj)配套使用的插件，用于利用nodebb提供oj前端

## 关于题目发布

> 要求发布者为`problem-makers`小组的成员

在文章中添加如下内容加载题目：
```
!<@hash>
```
> 其中，`hash`指代题目的hash值，访问bboj后端的`/list`查看

## 关于查看题目的权限

要求在bboj**单独**进行报名

**报名**可采用以下方法实现：

> 添加窗口部件：
```html
<div class="list-group">
<button id="enroll" type="button" class="list-group-item disabled" style="width:100%;" disabled>日常训练</button>
</div>
```
container如下：
```html
<div class="panel panel-default"><div class="panel-heading"><h3 class="panel-title">{{title}}</h3></div>{{body}}</div>
```

> 添加如下Js自定义代码：
```javascript
fetch(`http://localhost:3000/has-user?uid=${app.user.uid}`,{method:'GET',mode:'cors'})
.then((res)=>{
    return res.json()
}).then((res)=>{
    if(res){
        $('#enroll').html($('#enroll').text()+'<span class="badge">已参与</sapn>')
    }else{
        $('#enroll').removeAttr('disabled')
        $('#enroll').removeClass('disabled')
    }
})
$('#enroll').click(()=>{
    $('#enroll').attr('disabled','disabled')
    $('#enroll').addClass('disabled')
    fetch(`http://localhost:3000/enroll?uid=${app.user.uid}&name=${btoa(app.user.username)}`,
    {method:'GET',mode:'cors'})
    .then((res)=>{
        return res.json()
    }).then((res)=>{
        if(!res.success){
            $('#enroll').removeAttr('disabled')
            $('#enroll').removeClass('disabled')
            alert(res.reason)
        }else{
            $('#enroll').html($('#enroll').text()+'<span class="badge">已参与</sapn>')
        }
    })
})
```

## 关于添加积分榜

可采用以下方法实现：

> 添加窗口部件：
```html
<ul class="list-group" id="scoreboard">
</ul>
```

container如下：
```html
<div class="panel panel-default"><div class="panel-heading"><h3 class="panel-title">{{title}}</h3></div>{{body}}</div>
```

> 添加如下Js自定义代码：(此处每10s刷新一次)
```javascript
function renewScoreboard(){
    fetch('http://localhost:3000/scoreboard',{method:'GET',mode:'cors'})
    .then((res)=>{
        return res.json()
    }).then((data)=>{
        $('#scoreboard').empty()
        for(let it of data){
            $('#scoreboard').append(`
            <li class="list-group-item">
                ${it.name}<span class="badge">${it.score}</span>
            </li>`)
        }
        setTimeout(renewScoreboard,10*1000)
    })
}

renewScoreboard()
```