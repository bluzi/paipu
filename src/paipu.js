const resolveHandlers = async (context, transform, handlers) => {
  for (const handler of handlers) {
    if (handler instanceof Promise) {
      await handler(context, transform)
    } else if (handler instanceof Function) {
      handler(context, transform)
    }
  }
}

class Paipu {
  constructor () {
    this.transforms = []
    this.beforePipeHanlders = []
    this.afterPipeHanlders = []
  }

  static pipe (alias, transform) {
    return new Paipu().pipe(alias, transform)
  }

  static beforePipe (handler) {
    return new Paipu().beforePipe(handler)
  }

  static afterPipe (handler) {
    return new Paipu().afterPipe(handler)
  }

  pipe (alias, transform) {
    if (!transform) {
      transform = alias
      alias = undefined
    }

    this.transforms.push({ transform, alias })
    return this
  };

  async resolve (context) {
    let index = 0

    for (const { transform, alias } of this.transforms) {
      await resolveHandlers(context, alias || index, this.beforePipeHanlders)

      if (transform instanceof Function) {
        context = transform(context)
      } else if (transform.transforms) {
        context = await transform
          .beforePipe(this.beforePipeHanlders)
          .afterPipe(this.afterPipeHanlders)
          .resolve(context)
      } else if (transform instanceof Promise) {
        context = await transform(context)
      } else {
        context = transform
      }

      await resolveHandlers(context, alias || index, this.afterPipeHanlders)
      index++
    }

    return context
  }

  beforePipe (handler) {
    if (handler instanceof Array) {
      handler.forEach(this.beforePipe.bind(this))
    } else if (handler instanceof Function) {
      this.beforePipeHanlders.push(handler)
    } else {
      throw new Error(`Cannot resolve before pipe handler of type '${typeof handler}'`)
    }

    return this
  }

  afterPipe (handler) {
    if (handler instanceof Array) {
      handler.forEach(this.afterPipe.bind(this))
    } else if (handler instanceof Function) {
      this.afterPipeHanlders.push(handler)
    } else {
      throw new Error(`Cannot resolve after pipe handler of type '${typeof handler}'`)
    }

    return this
  }
}

export default Paipu
