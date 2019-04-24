export default function withEventValue<TReturnType>(
  func: (input: string) => TReturnType
) {
  return (event: React.ChangeEvent<HTMLInputElement>) =>
    func(event.target.value);
}
