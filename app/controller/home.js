const { Controller } = require('egg');

class HomeController extends Controller {
  async index() {
    const { ctx } = this;
    global.host = `${ctx.request.protocol}://${ctx.request.host}`;
    global.href = ctx.request.href;
    ctx.logger.info(111111)

    const render = require('../public/umi.server');
    ctx.logger.info(22222)

    const { err, html } = await render({
      path: ctx.request.url,
    });
    ctx.logger.info(33333)

    if (err) {
      ctx.status = 404;
      return;
    }
    ctx.logger.info(44444)

    ctx.body = html;
  }

}

module.exports = HomeController;
