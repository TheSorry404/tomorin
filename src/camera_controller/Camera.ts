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
  private readonly latitude: number
  private readonly longitude: number

  constructor(latitude: number, longitude: number) {
    this.latitude = latitude
    this.longitude = longitude
  }

  public getLatitude(): number {
    return this.latitude
  }

  public getLongitude(): number {
    return this.longitude
  }
}

const getPosition = (action_name: string) => {
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

export class Camera {
  public map: any
  public moveTo(action_name: string) {
    let position: Position = getPosition(action_name)
    console.log('Move to position:', position)
    this.map.setPosition({
      lat: position.getLatitude(),
      lng: position.getLongitude(),
    })
  }
}
