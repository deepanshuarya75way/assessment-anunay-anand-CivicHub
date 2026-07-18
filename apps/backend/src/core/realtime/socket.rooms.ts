export class SocketRooms {
  static postRoom(postId: string) {
    return `post:${postId}`;
  }

  static userRoom(userId: string) {
    return `user:${userId}`;
  }

  static communityRoom(communityId: string) {
    return `community:${communityId}`;
  }
}
