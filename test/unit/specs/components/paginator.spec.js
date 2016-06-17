import Vue from 'vue'
import CPaginator from 'components/c-paginator'

describe('paginator.vue', () => {
  let el

  beforeEach(() => {
    el = document.createElement('div')
    document.body.appendChild(el)
  })

  afterEach(() => {
    document.body.removeChild(el)
  })

  describe('should NOT render pages', () => {
    it('while count = 0', () => {
      const vm = new Vue({
        el,
        replace: false,
        template: '<c-paginator></c-paginator>',
        components: {
          CPaginator
        }
      })

      expect(vm.$children.length).to.equal(1)
      expect(vm.$children[0].$el.children.length).to.equal(0)
    })

    it('while $limit > count > 0', () => {
      const vm = new Vue({
        el,
        replace: false,
        template: '<c-paginator :count="1" :query="{ $limit: 2 }"></c-paginator>',
        components: {
          CPaginator
        }
      })

      expect(vm.$children[0].$el.children.length).to.equal(0)
    })

    it('while $limit >= count > 0', () => {
      const vm = new Vue({
        el,
        replace: false,
        template: '<c-paginator :count="2" :query="{ $limit: 2 }"></c-paginator>',
        components: {
          CPaginator
        }
      })

      expect(vm.$children[0].$el.children.length).to.equal(0)
    })
  })

  describe('should render pages', () => {
    it('while count > $limit', done => {
      const vm = new Vue({
        el,
        replace: false,
        template: '<c-paginator :count="2" :query="{ $limit: 1 }" @paginate="paginate"></c-paginator>',
        components: {
          CPaginator
        },
        methods: {
          paginate (data) {
            expect(data).to.eql({ $limit: 1, $offset: 1 })
            done()
          }
        }
      })

      const { children } = vm.$children[0].$el

      expect(children.length).to.equal(4)
      expect(children[0].classList.contains('disabled')).to.be.ok
      expect(children[1].classList.contains('disabled')).to.be.not.ok
      expect(children[1].classList.contains('current')).to.be.ok
      expect(children[2].classList.contains('disabled')).to.be.not.ok
      expect(children[3].classList.contains('disabled')).to.be.not.ok

      triggerMouseEvents(children[2], 'click')
    })

    it('while count > $limit 2', done => {
      const vm = new Vue({
        el,
        replace: false,
        template: '<c-paginator :count="10" :query="{ $limit: 1 }" @paginate="paginate"></c-paginator>',
        components: {
          CPaginator
        },
        methods: {
          paginate (data) {
            expect(data).to.eql({ $limit: 1, $offset: 8 })
            done()
          }
        }
      })

      const { children } = vm.$children[0].$el

      expect(children.length).to.equal(8)
      expect(children[4].textContent).to.equal('...')
      expect(children[5].textContent).to.equal('9')

      // will NOT trigger paginate
      triggerMouseEvents(children[4], 'click')
      // will trigger paginate
      triggerMouseEvents(children[5], 'click')
    })

    it('while count > $limit 3', done => {
      const vm = new Vue({
        el,
        replace: false,
        template: '<c-paginator :count="20" :query="{ $limit: 1, $offset: 10 }" @paginate="paginate"></c-paginator>',
        components: {
          CPaginator
        },
        methods: {
          paginate (data) {
            expect(data).to.eql({ $limit: 1, $offset: 10 })
            done()
          }
        }
      })

      const { children } = vm.$children[0].$el

      expect(children.length).to.equal(13)
      expect(children[3].textContent).to.equal('...')
      expect(children[6].textContent).to.equal('11')
      expect(children[6].classList.contains('current')).to.be.ok
      expect(children[9].textContent).to.equal('...')

      // will NOT trigger paginate
      triggerMouseEvents(children[3], 'click')
      // will trigger paginate
      triggerMouseEvents(children[6], 'click')
    })
  })
})