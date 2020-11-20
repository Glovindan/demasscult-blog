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
                            <div id="content_${id}" class="content content-max-height">
                                ${HtmlEncode(content)}
                            </div> 
                            <div class="author">
                                <div id="author" class="dmc-grey">
                                    by ${HtmlEncode(author)}
                                </div>
                            </div>
                        </div>`
        li.firstChild.addEventListener('click', function() {
            openPost(id);
        });                        
        ul.appendChild(li);
    }

    function openPost(id) {
        content = document.getElementById(`content_${id}`);
        post = document.getElementById(`post_${id}`);
        comments = document.getElementById(`comments_${id}`);
        content.className == "content" ? content.className = "content content-max-height" : content.className = "content";
        if(!comments){
            comments = document.createElement("div");
            comments.id = `comments_${id}`
            comments.style = "margin-top: 2vh;"
            comments.innerHTML = 
            `      
            <div id="post-actions-container" class="post-actions-container"> 
                <div class="post-actions-button-container">
                    <div id="edit" class="dmc-button dmc-border" title="Редактировать пост">
                        <img src="public/img/edit.png"/>
                    </div>
                </div>
                <div class="post-actions-button-container">
                    <div id="create" class="dmc-button dmc-border" title="Удалить пост">
                        <img src="public/img/delete.png"/>
                    </div>
                </div>
            </div>
            <form id="comments-create" class="comments-create-container">
                <textarea name="comments-create-text" id="comments-create-text" placeholder="Comment text" cols="30" rows="1"></textarea>
                <div class="comments-create-button">
                    <input id="comments-create-button" class="dmc-button" type="button" value="comment"/>
                </div>
            </form>
            <div class="comments-container">
                <div id="comment1" class="comments">
                    <span id="comment-user1" class="comments-author">John:</span> 
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc a lectus scelerisque, euismod dolor vitae, sagittis purus. Praesent sodales lacus nec ipsum fermentum consequat. Phasellus vestibulum sem magna, sed dignissim orci facilisis et. Praesent turpis lectus, ultrices sit amet mi id, lobortis congue mauris. Proin pharetra, est sed placerat sodales, nulla dolor dapibus sapien, a pretium nisl odio ut elit. Morbi vulputate varius efficitur. Sed sed enim quis est viverra iaculis venenatis eu magna. Maecenas ultrices ex vitae nibh ornare ultrices in eu lectus. Fusce aliquam consectetur bibendum. Aliquam egestas, erat congue feugiat lacinia, lacus lacus maximus lorem, eget vehicula lorem mauris tristique augue. Vestibulum nec tellus turpis. Ut sit amet urna nisl. Nunc porttitor imperdiet ipsum.
                </div>
                <div id="comment2" class="comments">
                    <span id="comment-user2" class="comments-author">Dave:</span> 
                    Aenean arcu mi, gravida vitae ornare sed, laoreet vestibulum velit. In libero nisl, cursus a aliquet a, ornare ac neque. Donec mattis purus quam, lacinia convallis erat gravida et. Aenean ut egestas diam, nec fermentum turpis. Aliquam feugiat libero eu orci euismod pellentesque. Praesent sollicitudin tellus vel suscipit tincidunt. Nullam eleifend ut ante nec tempus. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Donec semper ornare sapien, tempus egestas ipsum elementum ac.
                </div>
                <div id="comment3" class="comments">
                    <span id="comment-user3" class="comments-author">Anny:</span> Fusce eu convallis ante. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Nam at suscipit ligula. Quisque condimentum justo lectus, quis facilisis nisi pellentesque vitae. Sed malesuada efficitur scelerisque. Etiam laoreet eget felis a porta. Phasellus sit amet lectus pretium, vestibulum enim quis, vestibulum est. Mauris dapibus quis urna nec bibendum. Suspendisse lobortis euismod metus, id pellentesque justo hendrerit eget. Vestibulum tortor erat, lacinia feugiat tristique ut, pellentesque mattis metus. Cras convallis lobortis enim et interdum. Donec scelerisque bibendum nisl, at fringilla urna molestie a. Cras non orci justo. Aliquam pulvinar condimentum leo at euismod.
                </div>
                <div id="comments-load-more-wrapper" class="load-more-wrapper">
                    <div id="comments-load-more" class="load-more dmc-border dmc-font white medium">
                        <div class="unselectable">
                            Ещё комментарии
                        </div>
                    </div>
                </div>
            </div>`
            post.after(comments);
        } else {
            comments.remove();
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

    // async function loadNewPosts(loadCount) {
    //     let lastPostId;
    //     if(postCache.length == 0) {
    //         lastPostId = await server.getLastPostId();
    //         var loadedPosts = await server.getLastPosts(lastPostId.post_id + 1, loadCount);
    //     } else {
    //         lastPostId = postCache[postCache.length - 1].post_id;
    //         var loadedPosts = await server.getLastPosts(lastPostId, loadCount);
    //     }
    //     if(loadedPosts[0] != undefined) {
    //         postCache = postCache.concat(loadedPosts);
    //     } else {
    //         console.log('Постов больше нет');
    //     }
    // }   

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
    
    // ****************
    // EVENT LISTENERS
    // ****************
    document.getElementById("overlay").addEventListener('click', async function() {
        hide(document.getElementById("overlay"));
        hide(document.getElementById("post-create"));
        hide(document.getElementById("profile-container"));
        hide(document.getElementById("auth-form"));
    })

    document.getElementById("profile").addEventListener('click',async function() {
        await toggleVisible(document.getElementById("profile-container"));
        hide(document.getElementById("auth-form"));
        hide(document.getElementById("post-create"));
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