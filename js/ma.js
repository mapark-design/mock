/**
 * 定数定義
 * 無料登録アイコンをスクロールに合わせて処理。
 */
const CONST = {
  // ヘッダの高さ
  HEADER_HEIGHT: 72,
  // リクエストタイムアウト
  REQ_TIME_OUT: 10000,
  // キャッシュ
  REQ_CASHE: false,
  // アイコン文字列：visibility
  ICON_TEXT_VISIBILITY: 'visibility',
  // アイコン文字列：visibility
  ICON_TEXT_VISIBILITY_OFF: 'visibility_off'
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

  /**
   * 画面上部に戻る：アイコンスクロール処理
   */
  scrollTopIcon = function() {
    let $icon = $("#icon-top");
    if ($icon.length == 0) {
    $icon = $('<div>').attr('id', 'icon-top').addClass('move-top');
      let $button = $('<button>').addClass('move-top__icon');
      $('<span>').addClass('material-icons-outlined').addClass('md-48').text('vertical_align_top').appendTo($button);
      $button.appendTo($icon);
      $icon.appendTo($('body'));
    }
    // スクロール値の取得
    var scrollTop = $(this).scrollTop();
    if (scrollTop > CONST.HEADER_HEIGHT) {
      // スクロールがヘッダの高さを超えている場合、無料登録アイコンを表示する。
      $icon.fadeIn(500);

    } else {
      // そうでない場合、無料登録アイコンを表示しない。
      $icon.fadeOut(500);
    }
  }

  /**
   * リクエストに必要な引数の設定処理。
   * 
   * @param {*} maArgs システム側が指定したリクエストプロパティ
   * @param {*} args  ユーザが指定したリクエストプロパティ
   * @returns 引数
   */
  createArgs = function(maArgs, args) {
    return $.extend({}, {
      timeout: CONST.REQ_TIME_OUT,
      cashe: CONST.REQ_CASHE
    }, maArgs, args);
  }

  /**
   * POSTリクエストに必要な引数の設定処理。
   * 
   * @param {*} args  ユーザが指定したリクエストプロパティ
   * @returns 引数
   */
   createPostArgs = function(args) {
    return this.createArgs({
      type: 'POST'
    }, args);
  }

  /**
   * GETリクエストに必要な引数の設定処理。
   * 
   * @param {*} args  ユーザが指定したリクエストプロパティ
   * @returns 引数
   */
   createGetArgs = function(args) {
    return this.createArgs({
      type: 'GET'
    }, args);
  }

  /**
   * リクエスト処理。
   * 非同期処理を前提としている。
   * 
   * @param {*} arg  引数
   * @returns リクエスト結果
   */
  sendRequest = function(arg) {
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

  /**
   * ロード中のスクリーン表示。
   * ※#loader必須
   */
  loadScreen = function() {
    $("#loader").fadeIn(300).css('display', 'table');
  }

  /**
   * ロード中のスクリーン非表示。
   * ※#loader必須
   */
   offScreen = function() {
    $("#loader").fadeOut(300);
  }

  //+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
  // 以下本番時には削除予定
  //+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
  /**
   * セレクトオプション設定処理。
   * @param {*} path JSONファイルパス
   * @param {*} selector セレクトオプション設定先セレクタ
   */
  setOptions = function(path, selector) {
    this.sendRequest(this.createGetArgs({
      url: path
    })).done(function(data, statusText, jqXHR) {
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

  /**
   * チェックボックス設定処理。
   * @param {*} path JSONファイルパス
   * @param {*} querySelector チェックボックス設定先セレクタ
   * @param {*} prefix 接頭辞
   */
  setCheckbox = function(path, querySelector, prefix) {
    this.sendRequest(this.createGetArgs({
      url: path
    })).done(function(data, statusText, jqXHR) {
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

  /**
   * ラジオボタン設定処理。
   * @param {*} path JSONファイルパス
   * @param {*} querySelector ラジオボタン設定先セレクタ
   * @param {*} prefix 接頭辞
   */
   setRadio = function(path, querySelector, prefix) {
    this.sendRequest(this.createGetArgs({
      url: path
    })).done(function(data, statusText, jqXHR) {
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
  // メニュー背景色の拡大縮小の調整
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
  $(window).trigger('resize');

  // スクロール処理
  $(window).scroll(function() {
    if ($('#icon-regist').length > 0) {
      return false;
    }
    let $icon = $("#icon-top");
    if ($icon.length == 0) {
    $icon = $('<div>').attr('id', 'icon-top').addClass('move-top');
      let $button = $('<button>').addClass('move-top__icon');
      $button.click(function() {
        $('html, body').animate({
          scrollTop: 0
        }, 500);
      });
      $('<span>').addClass('material-icons-outlined').addClass('md-48').text('vertical_align_top').appendTo($button);
      $button.appendTo($icon);
      $icon.appendTo($('body'));
    }
    // スクロール値の取得
    var scrollTop = $(this).scrollTop();
    if (scrollTop > CONST.HEADER_HEIGHT) {
      // スクロールがヘッダの高さを超えている場合、無料登録アイコンを表示する。
      $icon.fadeIn(500);

    } else {
      // そうでない場合、無料登録アイコンを表示しない。
      $icon.fadeOut(500);
    }
  });

  // 利用しているjsの都合で、エンターキーを無効化
  $('#maform input').keydown(function(e) {
    if (e.which === 13) {
      $(this).blur();
      $(this).focus();
      return false;
    }
  });

  // パスワードの目を押下して項目の表示/非表示を切り替える
  $('.password-eye').click(function() {
    if (CONST.ICON_TEXT_VISIBILITY === $(this).text()) {
      $(this).parent('.form__item-input--password').children('.form-control').attr('type', 'text');
      $(this).text(CONST.ICON_TEXT_VISIBILITY_OFF);
      return;
    }
    $(this).text(CONST.ICON_TEXT_VISIBILITY);
    $(this).parent('.form__item-input--password').children('.form-control').attr('type', 'password');
  });

  // カンマ編集を設定する
  $('.format-comma').focus(function() {
    let reg = new RegExp(',', 'g');
    let val = $(this).val().replace(reg, '');
    if (!isNaN(val)) {
      $(this).val(val);
      $(this).select();
    }
  }).blur(function() {
    if ($(this).val().trim().length != 0 && !isNaN($(this).val())) {
      $(this).val(Number($(this).val()).toLocaleString());
    }
  });
});
