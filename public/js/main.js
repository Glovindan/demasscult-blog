window.onload = function () {
    const server = new Server();
    const loadCount = 10;
    let id = 1;
    let idMax = 0;
    let postCache = [];
    
    start(id);
    editMenuButtonsContent('unlogged');
    async function start(id) {//начальный метод
        if (await localStorage.getItem('login') && await localStorage.getItem('password')) {
            await server.auth(localStorage.getItem('login'),localStorage.getItem('password'));
            editMenuButtonsContent('logged');
        }
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

    async function hide(element) {
        element.style.display = 'none'; 
    }
    
    function openPost(id) {
        alert(`Post id = ${id}`);
    }
    function showPost(title, content, author, id) {//Показывает пост ниже загруженных постов
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
                            <div class="author">
                                <div id="author" class="dmc-grey">
                                    by ${HtmlEncode(author)}
                                </div>
                            </div>
                        </div>`
        li.addEventListener('click', function() {
            openPost(id);
        });                        
        ul.appendChild(li);
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

    async function loadNewPosts(loadCount) {
        let lastPostId;
        if(postCache.length == 0) {
            lastPostId = await server.getLastPostId();
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
            author = await server.getUserByPostId(postCache[id].post_id);
            showPost(postCache[id].post_title, postCache[id].post_text, author.user_name , postCache[id].post_id);
        }
        idMax = postCache.length;
    };

    function editMenuButtonsContent(status) {
        var container = document.getElementById("profile-container");
        switch(status) {
            case 'unlogged':
                var content = document.createElement("div");
                content.id = "sign-in";
                content.className = "dmc-button dmc-font white medium center dmc-border unselectable";
                var contentText = document.createElement("div");
                contentText.innerHTML = "Войти";
                content.append(contentText);

                content.addEventListener("click", ()=> {
                    toggleVisible(document.getElementById("auth-form"));
                });
                break;

            case 'logged':
                var content = document.createElement("div");
                content.id = "sign-out";
                content.className = "dmc-button dmc-font white medium center dmc-border unselectable";
                var contentText = document.createElement("div");
                contentText.innerHTML = "Выйти";
                content.append(contentText);

                content.addEventListener("click", async function() {
                    await server.logout();
                    editMenuButtonsContent('unlogged');
                });
                break;
                

        }   
        container.firstChild.replaceWith(content);
    }
    
    document.getElementById("overlay").addEventListener('click', async function() {
        hide(document.getElementById("overlay"));
        hide(document.getElementById("post-create"));
        hide(document.getElementById("profile-container"));
        hide(document.getElementById("auth-form"));
    })

    document.getElementById("profile").addEventListener('click',async function() {
        await toggleVisible(document.getElementById("profile-container"));
        hide(document.getElementById("auth-form"));
        await toggleVisible(document.getElementById("overlay"));
    });
    
    document.getElementById("create").addEventListener('click',async function() {
        await toggleVisible(document.getElementById("post-create"));
        await toggleVisible(document.getElementById("overlay"));
    });

    document.getElementById("post-create-button").addEventListener('click',async function() {
        const title = encodeURIComponent(document.getElementById('post-create-title').value);
        const text = encodeURIComponent(document.getElementById("post-create-text").value);
    
        if(title && text) {
            if (await server.createPost(title,text)) {
                toggleVisible(document.getElementById("post-create"));
                toggleVisible(document.getElementById("overlay"));
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

    document.getElementById("auth-login-button").addEventListener('click', async function() {
        login = document.getElementById("login-input").value;
        password = document.getElementById("password-input").value;
        user = await server.auth(login,password);
        if (user) {
            toggleVisible(document.getElementById("auth-form"));
            editMenuButtonsContent('logged');
        } else {
            console.log("Ошибка входа");
        }
        
    })  
    document.getElementById("auth-register-button").addEventListener('click', async function() {
        login = document.getElementById("login-input").value;
        password = document.getElementById("password-input").value;
        if(login && password) {
            user = await server.registration(login,password);
            if (user) {
                await server.auth(login,password);
                toggleVisible(document.getElementById("auth-form"));
                editMenuButtonsContent('logged');
            } else {
                console.log("Ошибка регистрации");
            }
        }
    })
};