import { Ora } from "ora";

type PromiseExecutor<T> = (
  resolve: (value: T | PromiseLike<T>) => void,
  reject: (reason?: any) => void
) => void;

export async function promiseWithSpinner(
  fn: PromiseExecutor<string | undefined>,
  spinner: Ora
) {
  await new Promise(fn)
    .catch(e => {
      spinner.fail(e);
      throw new Error(e);
    })
    .then(d => {
      spinner.succeed(d ?? undefined);
    })
}
