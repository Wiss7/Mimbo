export class BreedInfo {
  constructor(
    public id: string,
    public name: string,
    public bredFor: string,
    public breedGroup: string,
    public lifeSpan: string,
    public temperament: string,
    public origin: string,
    public weightKg: string,
    public weightLbs: string,
    public heightCM: string,
    public heightInches: string,
    public imageUrl: string
  ) {}
}
