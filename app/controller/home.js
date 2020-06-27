const { Controller } = require('egg');

class HomeController extends Controller {
  async index() {
    const { ctx } = this;
    global.host = `${ctx.request.protocol}://${ctx.request.host}`;
    global.href = ctx.request.href;

    const render = require('../public/umi.server');

    const { err, html } = await render({
      path: ctx.request.url,
    });

    if (err) {
      ctx.status = 404;
      return;
    }

    ctx.body = html;
  }

}

module.exports = HomeController;
