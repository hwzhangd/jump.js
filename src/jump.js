import easeInOutQuad from './easing'

export default class Jump {
  jump(target, options = {}) {
    this.start = window.pageYOffset

    this.options = {
      duration: options.duration,
      offset: options.offset || 0,
      callback: options.callback,
      easing: options.easing || easeInOutQuad
    }

    // based on typeof target, determine jump distance
    switch(typeof target) {
      case 'string':
        this.distance = this.options.offset + document.querySelector(target).getBoundingClientRect().top
      break

      case 'number':
        this.distance = target
      break

      default:
        // assume element node
        this.distance = this.options.offset + target.getBoundingClientRect().top
      break
    }

    this.duration = typeof this.options.duration === 'function'
      ? this.options.duration(this.distance)
      : this.options.duration

    requestAnimationFrame(time => this._loop(time))
  }

  _loop(time) {
    if(!this.timeStart) {
      this.timeStart = time
    }

    this.timeElapsed = time - this.timeStart
    this.next = this.options.easing(this.timeElapsed, this.start, this.distance, this.duration)

    window.scrollTo(0, this.next)

    this.timeElapsed < this.duration
      ? requestAnimationFrame(time => this._loop(time))
      : this._end()
  }

  _end() {
    window.scrollTo(0, this.start + this.distance)

    typeof this.options.callback === 'function' && this.options.callback()
    this.timeStart = false
  }
}
