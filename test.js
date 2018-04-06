const paipu = require('./paipu');
const assert = require('assert');


describe('paipu', () => {
    describe('pipes', () => {
        it('should resolve a simple pipe', async () => {
            const result =
                await paipu
                    .pipe('hello')
                    .pipe(context => context.substr(0, 4))
                    .resolve();

            assert(result === 'hell');
        });

        it('should resolve a simple pipe with aliases', async () => {
            const result =
                await paipu
                    .pipe('static string', 'hello')
                    .pipe('substring', context => context.substr(0, 4))
                    .resolve();

            assert(result === 'hell');
        });

        it('should resolve nested pipe', async () => {
            const encrypt = paipu
                .pipe(context => context.replace('a', 'b'))
                .pipe(context => context.replace('c', 'd'))

            const result =
                await paipu
                    .pipe('abcdefg')
                    .pipe(encrypt)
                    .resolve();

            assert(result === 'bbddefg');
        });

        it('should resolve async pipe', async () => {
            const encrypt = paipu
                .pipe(context => context.replace('a', 'b'))
                .pipe(context => context.replace('c', 'd'))

            const result =
                await paipu
                    .pipe('abcdefg')
                    .pipe(async context => context.substr(0, 3))
                    .resolve();

            assert(result === 'abc');
        });
    });

    describe('handlers', () => {
        describe('before', () => {
            it('should execute before handler', async () => {
                let timesHandlerCalled = 0;

                const result =
                    await paipu
                        .beforePipe(() => timesHandlerCalled++)
                        .pipe('abcdefg')
                        .pipe(async context => context.substr(0, 3))
                        .resolve();

                assert(timesHandlerCalled === 2);
            });

            it('should execute before handler on nested pipes', async () => {
                const encrypt = paipu
                    .pipe(context => context.replace('a', 'b'))
                    .pipe(context => context.replace('c', 'd'))

                let timesHandlerCalled = 0;

                const result =
                    await paipu
                        .beforePipe(() => timesHandlerCalled++)
                        .pipe('abcdefg')
                        .pipe(encrypt)
                        .pipe(async context => context.substr(0, 3))
                        .resolve();

                assert(timesHandlerCalled === 5);
            });
        });
        describe('after', () => {
            it('should execute after handler', async () => {
                let timesHandlerCalled = 0;

                const result =
                    await paipu
                        .afterPipe(() => timesHandlerCalled++)
                        .pipe('abcdefg')
                        .pipe(async context => context.substr(0, 3))
                        .resolve();

                assert(timesHandlerCalled === 2);
            });

            it('should execute after handler on nested pipes', async () => {
                const encrypt = paipu
                    .pipe(context => context.replace('a', 'b'))
                    .pipe(context => context.replace('c', 'd'))

                let timesHandlerCalled = 0;

                const result =
                    await paipu
                        .afterPipe(() => timesHandlerCalled++)
                        .pipe('abcdefg')
                        .pipe(encrypt)
                        .pipe(async context => context.substr(0, 3))
                        .resolve();

                assert(timesHandlerCalled === 5);
            });
        });
    });
});
