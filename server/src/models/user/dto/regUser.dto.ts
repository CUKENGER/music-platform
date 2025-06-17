export class RegUserDto {
  email: string;
  id: number;
  isActivated: boolean;

  constructor(model: { id: number; email: string; isActivated: boolean }) {
    this.id = model.id;
    this.email = model.email;
    this.isActivated = model.isActivated;
  }
}
