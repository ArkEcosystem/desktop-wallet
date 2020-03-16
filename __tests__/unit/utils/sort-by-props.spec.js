import sortByProps from '@/utils/sort-by-props'

describe('sortByProps', () => {
  it('should return the data sorted by a single property passed as String', () => {
    const numbers = [
      { foo: 3 },
      { foo: 2 },
      { foo: 1 }
    ]

    expect(numbers.sort(sortByProps('foo'))).toEqual([
      { foo: 1 },
      { foo: 2 },
      { foo: 3 }
    ])
  })

  it('should return the data sorted by a single property passed as Array', () => {
    const numbers = [
      { foo: 3 },
      { foo: 2 },
      { foo: 1 }
    ]

    expect(numbers.sort(sortByProps(['foo']))).toEqual([
      { foo: 1 },
      { foo: 2 },
      { foo: 3 }
    ])
  })

  it("should return the data sorted by a single property when the property's values are numbers", () => {
    const numbers = [
      { foo: 3 },
      { foo: 2 },
      { foo: 1 }
    ]

    expect(numbers.sort(sortByProps('foo'))).toEqual([
      { foo: 1 },
      { foo: 2 },
      { foo: 3 }
    ])
  })

  it("should return the data sorted by a single property when the property's values are strings", () => {
    const strings = [
      { bar: '3' },
      { bar: '2' },
      { bar: '1' }
    ]

    expect(strings.sort(sortByProps('bar'))).toEqual([
      { bar: '1' },
      { bar: '2' },
      { bar: '3' }
    ])
  })

  it('should return the data sorted by multiple properties when there are distinct values', () => {
    const data = [
      { foo: 6, bar: 3 },
      { foo: 5, bar: 2 },
      { foo: 4, bar: 1 }
    ]

    expect(data.sort(sortByProps(['foo', 'bar']))).toEqual([
      { foo: 4, bar: 1 },
      { foo: 5, bar: 2 },
      { foo: 6, bar: 3 }
    ])
  })

  it('should return the data sorted by multiple properties when there are equal values', () => {
    const data = [
      { foo: 0, bar: 3 },
      { foo: 0, bar: 2 },
      { foo: 0, bar: 1 }
    ]

    expect(data.sort(sortByProps(['foo', 'bar']))).toEqual([
      { foo: 0, bar: 1 },
      { foo: 0, bar: 2 },
      { foo: 0, bar: 3 }
    ])
  })

  it('should use natural sort order by default', () => {
    const data = [
      { foo: '1' },
      { foo: '100' },
      { foo: '2' }
    ]

    expect(data.sort(sortByProps('foo'))).toEqual([
      { foo: '1' },
      { foo: '2' },
      { foo: '100' }
    ])
  })
})
