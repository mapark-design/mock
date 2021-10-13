/**
 * 定数定義
 * 無料登録アイコンをスクロールに合わせて処理。
 */
const CONST = {
  HEADER_HEIGHT: 72
};

class Ma {
  /**
   * サイトトップ：アイコンスクロール処理
   */
  scrollIcon = function() {
    // スクロール値の取得
    var scrollTop = $(this).scrollTop();
    if (scrollTop > CONST.HEADER_HEIGHT) {
      // スクロールがヘッダの高さを超えている場合、無料登録アイコンを表示する。
      $("#icon-regist").slideDown(800);
    } else {
      // そうでない場合、無料登録アイコンを表示しない。
      $("#icon-regist").slideUp(800);
    }

    // 画面の高さおよびfooterの現在位置を表示する。
    var windowInnerHeight = $(this).innerHeight();
    var footerTop = $(".footer").offset().top;

    if (scrollTop + windowInnerHeight >= footerTop) {
      // footer が表示された場合、それに合わせてアイコンの位置を変更する。
      var bottoms = (scrollTop + windowInnerHeight) - footerTop;
      $("#icon-regist").css('bottom', bottoms);
    } else {
      // footer が表示されていない場合、一定箇所にアイコンを固定する。
      $("#icon-regist").css('bottom', '10px');
    }
  }

  ajax = function(args, done, fail, always) {
    $.ajax({
      type: args.type,
      url: args.url,
      data: args.data,
      cache: false
    })
    .done(function(data, textStatus, jqXHR) {
      done(data, textStatus, jqXHR);
      console.info(data);
    })
    .fail(function( jqXHR, textStatus, errorThrown ) {
      console.error(jqXHR);
    })
    .always(function( jqXHR, textStatus ) {
      if (always) {
        always(jqXHR, textStatus);
      }
      console.info(jqXHR);
    });
  }

  //+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
  // 以下本番時には削除予定
  //+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
  setOptions = function(path, selector) {
    this.ajax({
      type: 'get',
      url: path
    }, function(data, textStatus, jqXHR) {
      var $options = [];
      data.forEach(function(el, idx) {
        $options.push(
          $("<option>", {
            value: el.value,
            text: el.name
          })
        );
        $(selector).append($options);
      });
    });
  }

  setCheckbox = function(path, querySelector, prefix) {
    this.ajax({
      type: 'get',
      url: path
    }, function(data, textStatus, jqXHR) {
      var options = [];
      data.forEach(function(el, idx) {
        var input = $("<input>", {
          id: prefix + el.value,
          type: 'checkbox',
          value: el.value
        }).addClass('form-check-input');
        var label = $("<label>", {
          for: prefix + el.value,
        }).addClass('form-check-label').text(el.name);
        var div = $("<div>").addClass('form-check').append(input, label);
        options.push(div);
      });

      $(querySelector).append(options);
    });
  }
}

$(function () {
  $(window).resize(function() {
    let timer = false;
    if (!timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(function() {
      var $maNav = $('.ma-nav');
      if ($maNav.length == 0) {
        // ma-nav がないページには何も行わない。
        return;
      }

      var windowHeight = $(window).height();
      var navHeight = $('.ma-nav__inner').outerHeight();
      var mainHeight = $('.main__inner').outerHeight();
      var maxHeight = navHeight > mainHeight ? navHeight : mainHeight;

      if (windowHeight > maxHeight + CONST.HEADER_HEIGHT) {
        $('.ma-nav').addClass('ma-nav__inner--height');
      } else {
        $('.ma-nav').removeClass('ma-nav__inner--height');
      }
    }, 200);
  });

  $(window).trigger('resize')
});
