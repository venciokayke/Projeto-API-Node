const assert = require('node:assert/strict');

// Substitui apenas o acesso ao banco para testar os handlers sem conexão externa.
let duplicate = false;
let missingRelation = false;
let queries = [];
const repository = {
    findOne: async (query) => {
        queries.push(query);
        return query.where.name ? (duplicate ? { id: 2 } : null) : { id: 1 };
    },
    findOneBy: async () => missingRelation ? null : { id: 1 },
    create: (data) => data,
    save: async (data) => data,
};
require.cache[require.resolve('../dist/data-source')] = {
    exports: { AppDataSource: { getRepository: () => repository } },
};

async function run() {
    for (const [controller, path] of [
        ['ProductCategoriesController', '/product-categories'],
        ['ProductSituationsController', '/product-situations'],
        ['ProductsController', '/products'],
    ]) {
        const router = require(`../dist/controllers/${controller}`).default;
        for (const method of ['post', 'put']) {
            const route = router.stack.find(layer => layer.route?.path === path + (method === 'put' ? '/:id' : '') && layer.route.methods[method]);
            async function request(body, id = '1') {
                const res = { status(code) { this.code = code; return this; }, json(value) { this.body = value; return this; } };
                queries = [];
                await route.route.stack[0].handle({ body, params: { id } }, res);
                return res;
            }
            const valid = { name: 'Teste', categoryId: 1, situationId: 1 };
            for (const name of ['', 'te', null]) {
                const res = await request({ ...valid, name });
                assert.equal(res.code, 400);
                assert.ok(Array.isArray(res.body.message));
                assert.equal(queries.length, 0);
            }
            assert.equal((await request({})).code, 400);
            if (path === '/products') {
                for (const field of ['categoryId', 'situationId']) {
                    assert.equal((await request({ ...valid, [field]: 'abc' })).code, 400);
                    assert.equal((await request({ ...valid, [field]: undefined })).code, 400);
                }
                missingRelation = true;
                assert.equal((await request({ ...valid })).code, 404);
                missingRelation = false;
            }
            duplicate = true;
            assert.equal((await request({ ...valid })).code, 400);
            if (method === 'put') {
                assert.equal(queries[0].where.id.type, 'not');
                assert.equal(queries[0].where.id.value, 1);
            }
            duplicate = false;
            assert.equal((await request({ ...valid })).code, method === 'post' ? 201 : 200);
            if (method === 'put') {
                assert.equal((await request({ ...valid }, 'abc')).code, 400);
                if (path === '/product-situations') {
                    assert.equal((await request({ nameSituation: 'Teste' })).code, 200);
                }
            }
        }
    }
    console.log('Validações dos três controllers verificadas em POST e PUT.');
}

run().catch(error => { console.error(error); process.exitCode = 1; });
