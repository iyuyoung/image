// 名片分享样式
export default class LastMayday {
    data = {};

    do (data) {
      this.data = data
      return this._template()
    }

    TEXT_SMALL = {
      fontSize: '24rpx'
    };

    _template (index = 1) {
      let background = ``
      if (index === 1) {
        return ({
          background: background,
          width: '460px',
          height: '830px',
          borderRadius: '20px',
          views: [{
            type: 'image',
            url: this.data.avatar,
            css: {
              top: '64px',
              right: '139px',
              width: '180px',
              height: '180px',
              borderRadius: '100px',
              align: 'right'
            }
          },
          {
            type: 'text',
            text: this.data.name,
            css: {
              left: '230px',
              top: '270px',
              color: '#333333',
              fontSize: '32px',
              align: 'center'
            }
          }
          ]
        })
      }
    }
}
