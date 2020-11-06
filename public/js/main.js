window.onload = function () {
    const server = new Server();
    const loadCount = 10;
    let id = 1;
    let idMax = 0;
    let postCache = [];

    start(id);

    async function start(id) {//начальный метод
        await loadPosts(loadCount);
        await showPosts();
    }

    async function toggleVisible(element) {//показывает скрывает element
        if (element.style.display == 'none') {
            element.style.display = 'block';
        } else {
            element.style.display = 'none';
        }
    }

    async function toggleLoadScreen() {//Показывает/скрывает загрузку
        toggleVisible(document.getElementById('loading'));
    }
    function openPost(id) {
        alert(`Post id = ${id}`);
    }
    function showPost(title, content, id) {//Показывает пост ниже загруженных постов
        var ul = document.getElementById("post-container");
        var li = document.createElement("li");
        li.className = "post";
        li.innerHTML = `<div id="post_${id}" class="post-outline dmc-border">
                            <div class="title">
                                <div id="title" class="dmc-grey">
                                    ${HtmlEncode(title)}
                                </div>
                            </div>
                            <div id="content" class="content">
                                ${HtmlEncode(content)}
                            </div> 
                        </div>`
        li.addEventListener('click', function() {
            openPost(id);
        });                        
        ul.appendChild(li);
        console.log(li.value);
    }

    async function auth(login, password) {
        user = server.auth();
        if(user) {
            server.user = user;
        }
    }

    function HtmlEncode(s){//переводит спецсимволы html для нормального отображения в документе
        var el = document.createElement("div");
        el.innerText = el.textContent = s;
        s = el.innerHTML;
        return s;
    }

    async function loadPosts(loadCount) {
        let lastPostId;
        if(postCache.length == 0) {
            lastPostId = await server.getLastPostId();
            console.log(lastPostId);
            var loadedPosts = await server.getLastPosts(lastPostId.post_id + 1, loadCount);
        } else {
            lastPostId = postCache[postCache.length - 1].post_id;
            var loadedPosts = await server.getLastPosts(lastPostId, loadCount);
        }
        if(loadedPosts[0] != undefined) {
            postCache = postCache.concat(loadedPosts);
        } else {
            console.log('Постов больше нет');
        }
    }


    async function showPosts() {
        for(id = idMax; id < postCache.length; id++) {
            showPost(postCache[id].post_title, postCache[id].post_text, postCache[id].post_id);
        }
        idMax = postCache.length;
    };
    
    document.getElementById("profile").addEventListener('click',async function() {
        await toggleVisible(document.getElementById("profile-container"));
        await toggleVisible(document.getElementById("overlay"));
    });
    
    document.getElementById("create").addEventListener('click',async function() {
        await toggleVisible(document.getElementById("post-create"));
        await toggleVisible(document.getElementById("overlay"));
    });

    document.getElementById("post-create-button").addEventListener('click',async function() {
        const title = encodeURIComponent(document.getElementById('post-create-title').value);
        const text = encodeURIComponent(document.getElementById("post-create-text").value);
        const code = document.getElementById("post-create-code").value;
        console.log(code);
        const userId = 1;
    
        if(title && text && code) {
            if (await server.createPost(title,text,code,userId)) {
                toggleVisible(document.getElementById("post-create"));
            } else
            alert("Ошибка");
        } else {
            alert("Введите заголовок и текст поста!");
        }
    });

    document.getElementById("load-more").addEventListener('click', async function() {
        await loadPosts(loadCount);
        await showPosts();
    })

    document.getElementById("sign-in").addEventListener('click', async function() {
        await toggleVisible(document.getElementById("auth-form"));
    })
};