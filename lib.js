const Group = require.main.require('./src/groups')
const proxy = require('express-http-proxy')

const bbojInterface = {
    init(data, callback) {
        data.router.use('/oj', proxy('localhost:3000'))
    },
    parsePost(data, callback) {
        Group.get('problem-makers', { uid: data.postData.uid }, (err, result) => {
            data.postData.content = applyOJ(data.postData.content, !err && !!result && result.isMember)
            callback(null, data)
        })
    }
}

function applyOJ(data, type) {
    if (type) {
        return data.replace(/!&lt;@([0-9a-f]+)&gt;/g, `<div id="$1" class="well"></div>
        <script>
        fetch(\`http://localhost:3000/view?uid=\${window.app.user.uid}&problem=$1\`,
            {
                method:'get',
                mode: 'cors'
            })
            .then(function (res) {
                return res.text()
            }).then((text) => {
                document.getElementById('$1').innerHTML = text
            })
        </script>`)
    } else {
        return data.replace(/!&lt;@[0-9a-f]+&gt;/g, '<div class="well">当前题目无法显示</div>')
    }
}

module.exports = bbojInterface