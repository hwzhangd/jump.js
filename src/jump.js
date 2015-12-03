import easeInOutQuad from './easing'

export default class Jump {
  jump(target, options = {}) {
    this.start = window.pageYOffset
    this.target = target

    this.options = {
      duration: options.duration,
      offset: options.offset || 0,
      callback: options.callback,
      easing: options.easing || easeInOutQuad
    }

    this.toElement = typeof this.target === 'string'
      ? document.querySelector(this.target)
      : false

    this.distance = this.toElement
      ? this.options.offset + this.toElement.getBoundingClientRect().top
      : this.target

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

    if(this.toElement) {
      this.toElement.setAttribute('tabindex', '-1')
      this.toElement.focus()
    }

    typeof this.options.callback === 'function' && this.options.callback()
    this.timeStart = false
  }
}
