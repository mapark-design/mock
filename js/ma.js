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

  // ajax呼び出し共通
 ajaxAction = function(data) {
  var deferred = new $.Deferred();    // ※1
  $.ajax(data).then(
      //成功処理
      function (data) {
        deferred.resolve();     // こうすると呼び出し側で個別の処理ができる
        console.log('ajax成功：共通部分');  // 成功時の共通処理とか書く
      },
      //失敗処理
      function (data) {
        deferred.rejected();    // こうすると呼び出し側で個別の処理ができる
        console.log('ajax失敗：共通部分');  // 失敗時の共通処理とか書く
      }
  );
  return deferred;
}

  sendAjaxRequest = function($args) {
    let d = $.Deferred();
    $.ajax($args)
    .done(function(data) {
      console.info('ma-done');
      d.resolve(true);
    }).fail(function(xhr,err) {
      console.info('ma-error');
      d.resolve(false);
    }).always(function() {
      console.info('ma-always');
      $("#loader").fadeOut(300);
    });
    return d.promise();
  };

  myAjax = function(arg) {
    var opt = $.extend({}, $.ajaxSettings, arg);
    var jqXHR = $.ajax(opt);

    var defer = $.Deferred();

    jqXHR.done(function(data, statusText, jqXHR) {
        console.log('done(=success)時の共通処理 ...');

        // defer.resovle ではなくて defer.resolveWith で
        // myAjax(...).done() 内でのthisのコンテキストを
        // 明示的に指定する
        defer.resolveWith(this, arguments);
    });

    jqXHR.fail(function(jqXHR, statusText, errorThrown) {
        console.log('fail(=error)時の共通処理 ...');

        // defer.reject ではなくて defer.rejectWith で
        // myAjax(...).fail() 内でのthisのコンテキストを
        // 明示的に指定する
        defer.rejectWith(this, arguments);
    });

    jqXHR.always(function() {
        console.log('always(=complete)時の共通処理 ...');
        $("#loader").fadeOut(300);
      });

    return $.extend({}, jqXHR, defer.promise());
}

  ajax = function(args, done, fail, always) {
    $.ajax({
      type: args.type,
      url: args.url,
      data: args.data,
      cache: false
    })
    .done(function(data, textStatus, jqXHR) {
      setTimeout(function() {
        console.info('infoX');
        done(data, textStatus, jqXHR);
      }, 2000);
      console.info('info');
    })
    .fail(function( jqXHR, textStatus, errorThrown ) {
      console.error('error');
    })
    .always(function( jqXHR, textStatus ) {
      if (always) {
        always(jqXHR, textStatus);
      }
      console.info('always');
      $("#loader").fadeOut(300);
    });
  }

  /**
   * ファイルモーダル表示処理。
   * @param {*} args パラメータ
   * @param {*} selector 対象リンクのセレクタ
   */
  createModal = function(args, selector) {
    $(selector).modaal(args);
  }

  /**
   * PDFファイルモーダル表示処理。
   * @param {*} selector 対象リンクのセレクタ
   */
  createModalPdf = function(selector) {
    this.createModal({
      type: 'iframe',
      fullscreen: true
    }, selector);
  }

  /**
   * 画像ファイルモーダル表示処理。
   * @param {*} selector 対象リンクのセレクタ
   */
  createModalImage = function(selector) {
    this.createModal({
      type: 'image',
      fullscreen: false
    }, selector);
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
      });
      $(selector).append($options);
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

  setRadio = function(path, querySelector, prefix) {
    this.ajax({
      type: 'get',
      url: path
    }, function(data, textStatus, jqXHR) {
      var options = [];
      data.forEach(function(el, idx) {
        var input = $("<input>", {
          id: prefix + el.value,
          name: prefix,
          type: 'radio',
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
