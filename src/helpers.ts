import { Ora } from "ora";

type PromiseExecutor<T> = (
  resolve: (value: T | PromiseLike<T>) => void,
  reject: (reason?: any) => void
) => void;

type PromiseWithSpinnerOptions = {
  persistOnFail?: boolean;
}
export async function promiseWithSpinner(
  fn: PromiseExecutor<string | undefined>,
  spinner: Ora,
  opts?: PromiseWithSpinnerOptions
) {
  await new Promise(fn)
    .catch(e => {
      if (opts?.persistOnFail ?? true) {
        spinner.fail(e);
      } else {
        spinner.stop();
      }

      throw new Error(e);
    })
    .then(d => {
      spinner.succeed(d ?? undefined);
    })
}
