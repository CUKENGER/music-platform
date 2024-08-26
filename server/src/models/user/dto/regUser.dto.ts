

export class RegUserDto {
  email: string;
  id: string
  isActivated: boolean;

  constructor(model) {
    this.id = model.id;
    this.email = model.email
    this.isActivated = model.isActivated
  }
}