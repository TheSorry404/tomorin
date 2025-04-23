// 售票处@39.9981931,116.2808454,16.73z
// 画中游@39.9989406,116.2645878,15z
// 长廊@39.9989406,116.2645878,15z
// 文昌阁@39.9989406,116.2645878,15z
// 昆明湖@39.9931629,116.2725099,16.73z
// [
//   {"type": "function", "function": {"name": "go_shoupiaochu", "description": "切换到地点：售票处"}},
//   {"type": "function", "function": {"name": "go_huazhongyou", "description": "切换到地点：画中游"}},
//   {"type": "function", "function": {"name": "go_changlang", "description": "切换到地点：长廊"}},
//   {"type": "function", "function": {"name": "go_wenchangge", "description": "切换到地点：文昌阁"}},
//   {"type": "function", "function": {"name": "go_kunminghu", "description": "切换到地点：昆明湖"}}
// ]
class Position {
  constructor(latitude: number, longitude: number) {}

  private latitude: number | undefined
  private longitude: number | undefined

  public get getLatitude() {
    return this.latitude
  }

  public get getLongitude() {
    return this.longitude
  }

  Position(latitude: number, longitude: number) {
    this.latitude = latitude
    this.longitude = longitude
  }
}

const getLocation = (action_name: string) => {
  if (action_name === 'go_shoupiaochu') {
    return new Position(39.9981931, 116.2808454)
  } else if (action_name === 'go_huazhongyou') {
    return new Position(39.9989406, 116.2645878)
  } else if (action_name === 'go_changlang') {
    return new Position(39.9989406, 116.2645878)
  } else if (action_name === 'go_wenchangge') {
    return new Position(39.9989406, 116.2645878)
  } else if (action_name === 'go_kunminghu') {
    return new Position(39.9931629, 116.2725099)
  } else {
    throw new Error('Unknown action name')
  }
}

class Camera {
  moveTo(position: Position) {
    console.log('Move to position:', position)

  }
}
