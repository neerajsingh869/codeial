{
    // method to submit the form data to backend
    const createPost = () => {
        let formEle = $('#post-form');

        formEle.submit((e) => {
            e.preventDefault();

            $.ajax({
                type: 'post',
                url: '/posts/save-post',
                dataType: 'json',
                data: formEle.serialize(),
                success: (data) => {
                    new Noty({
                        type: 'success',
                        theme: 'relax',
                        text: data.message,
                        timeout: 1500,
                        layout: 'topRight'
                    }).show();

                    let newPostDOM = createPostInDOM(data.post);
                    $('#posts-list-container > ul').prepend(newPostDOM);

                    new ToggleLike($(' .toggle-like-button', newPostDOM));

                    // attach an event handler to element with class 'delete-post-button'
                    // that are descendents of newPostDOM
                    let deleteLinkTag = $(' .delete-post-button', newPostDOM);
                    deletePost( deleteLinkTag );

                    // attach a submit action listener on post's comment form
                    let commentForm = $(' .comment-form', newPostDOM)
                    createComment(commentForm, data.post._id);
                    
                }, 
                error: (error) => {
                    new Noty({
                        type: 'error',
                        theme: 'relax',
                        text: 'Error in saving post',
                        timeout: 1500,
                        layout: 'topRight'
                    }).show();

                    console.error(error);
                }
            });     
        });
    }

    // method to create fetched post dom
    const createPostInDOM = (post) => {
        return $(`<li id="post-${ post._id }">
        <div>
            ${ post.content }
            ${ post.user.name }
            <a class="toggle-like-button" data-likes="0" href="/likes/toggle?id=${ post._id }&type=Post">
                0 likes
            </a>
            <button>
                <a class="delete-post-button" href="posts/destroy/${ post._id }">Delete Post</a>
            </button> 
        </div>
        <div>
            <form action="comments/save-comment/${ post._id }" class="comment-form" method="post">
                <textarea 
                        name="content" 
                        cols="20" 
                        rows="2" 
                        placeholder="Comment here..."></textarea>
                <br>
                <input type="submit" value="Comment">
            </form> 
            <div id="${ post._id }-comments-list-container">
                <ul></ul>
            </div>
        </div>
    </li>`);
    }

     // method to delete post using ajax
     const deletePost = (deleteLinkTag) => {

        deleteLinkTag.on('click', e => {
            e.preventDefault();

            $.ajax({
                type: 'get',
                url: deleteLinkTag.attr('href'),
                success: (data) => {
                    new Noty({
                        type: 'success',
                        theme: 'relax',
                        text: data.message,
                        timeout: 1500,
                        layout: 'topRight'
                    }).show();

                    $(`#post-${ data.postId }`).remove();
                }, 
                error: (error) => {
                    new Noty({
                        type: 'error',
                        theme: 'relax',
                        text: 'Error in deleting post',
                        timeout: 1500,
                        layout: 'topRight'
                    }).show();

                    console.error(error);
                }
            });
        })
    }

    


    // function to apply action listener on comment's form submit
    const createComment = (commentForm, postId) => {
        commentForm.submit(e => {
            e.preventDefault();

            $.ajax({
                type: 'post',
                url: `comments/save-comment/${ postId }`,
                dataType: 'json',
                data: commentForm.serialize(),
                success: (data) => {
                    new Noty({
                        type: 'success',
                        theme: 'relax',
                        text: data.message,
                        timeout: 1500,
                        layout: 'topRight'
                    }).show();
                    // show the comment in dom
                    let newCommentDOM = createCommentInDOM(data.comment)
                    $(`#${ postId }-comments-list-container > ul`).prepend(newCommentDOM);
                    new ToggleLike($(' .toggle-like-button', newCommentDOM));

                    // also apply delete action listener to delete comment

                    // attach an event handler to element with class 'delete-post-button'
                    // that are descendents of newPostDOM
                    let deleteLinkTag = $(' .delete-comment-button', newCommentDOM);
                    deleteComment( deleteLinkTag );

                },
                error: (error) => {
                    new Noty({
                        type: 'error',
                        theme: 'relax',
                        text: 'Error in saving comment',
                        timeout: 1500,
                        layout: 'topRight'
                    }).show();
                    console.error(error);
                }
            })
        })
    }

    const createCommentInDOM = (comment) => {
        return $(`<li id="comment-${ comment._id }">
                    ${ comment.content }
                    =
                    ${ comment.user.name }
                    <a class="toggle-like-button" data-likes="0" href="/likes/toggle?id=${ comment._id }&type=Comment">
                        0 likes
                    </a>
                    <button>
                        <a class="delete-comment-button" href="comments/destroy/${ comment._id }">Delete Comment</a>
                    </button> 
                </li>`);
    }

    const deleteComment = (deleteLinkTag) => {
        deleteLinkTag.on('click', e => {
            e.preventDefault();

            $.ajax({
                type: 'get',
                url: deleteLinkTag.attr('href'),
                success: (data) => {
                    new Noty({
                        type: 'success',
                        theme: 'relax',
                        text: data.message,
                        timeout: 1500,
                        layout: 'topRight'
                    }).show();

                    $(`#comment-${ data.commentId }`).remove();
                }, 
                error: (error) => {
                    new Noty({
                        type: 'error',
                        theme: 'relax',
                        text: 'Error in deleting post',
                        timeout: 1500,
                        layout: 'topRight'
                    }).show();

                    console.error(error);
                }
            });
        })
    }

    // apply delete action listener to all posts
    // during initial rendering
    let postLists = $('#posts-list-container > ul > li');

    for (let post of postLists) {
        let postId = post.attributes.id.nodeValue.split('-')[1];
        let commentList  = $(` #${ postId }-comments-list-container > ul > li`, post);
        for (let comment of commentList) {
            let commentDeleteLinkTag = $(' .delete-comment-button', comment);
            deleteComment( commentDeleteLinkTag );
        }
        let deleteLinkTag = $(' .delete-post-button', post);
        deletePost( deleteLinkTag );
    }
    
    createPost();
}