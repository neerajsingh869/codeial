class ToggleLike{
    constructor(toggleElement) {
        this.toggler = toggleElement;
        this.toggleLike();
    }

    toggleLike() {
        $(this.toggler).click(function(e) {
            e.preventDefault();

            let self = this;

            $.ajax({
                type: 'POST',
                url: $(self).attr('href')
            }).done(function(data) {
                let likesCount = parseInt($(self).attr('data-likes'));
                console.log(likesCount);

                if (data.data.deleted === true) {
                    likesCount--;
                } else {
                    likesCount++;
                }

                $(self).attr('data-likes', likesCount);
                $(self).html(`${ likesCount } likes`)
            }).fail(function(error) {
                console.error('Error in toggling likes ', error);
            });
        })
    }
}