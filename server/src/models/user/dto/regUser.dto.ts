export class RegUserDto {
  email: string;
  id: number;
  isActivated: boolean;

  constructor(model) {
    this.id = model.id;
    this.email = model.email;
    this.isActivated = model.isActivated;
  }
}
