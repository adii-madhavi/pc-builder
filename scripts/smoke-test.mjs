import assert from 'node:assert/strict';
const base = process.env.TEST_URL || 'http://localhost:3000';
async function request(path, {token, ...options} = {}) {
  const response = await fetch(base + '/api' + path, { ...options, headers: {'Content-Type':'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {})} });
  const body = await response.json();
  return {status: response.status, data: body.success && 'data' in body ? body.data : body};
}
const email = `regression-${Date.now()}@example.test`;
const password = 'Regression-only-729!';
const parts = {};
for (const type of ['cpu','motherboard','gpu','ram','storage','psu','cooler','case']) {
  const response = await request('/components/type/'+type);
  assert.equal(response.status,200);
  assert.ok(response.data.components.length, type+' catalog is empty');
  parts[type] = ['ram','storage'].includes(type) ? [response.data.components[0]] : response.data.components[0];
}
const registered = await request('/auth/register',{method:'POST',body:JSON.stringify({email,password,username:'Regression test'})});
assert.equal(registered.status,200,JSON.stringify(registered.data));
const login = await request('/auth/login',{method:'POST',body:JSON.stringify({email: ' '+email.toUpperCase()+' ',password})});
assert.equal(login.status,200);
const token = login.data.token;
assert.equal((await request('/auth/login',{method:'POST',body:JSON.stringify({email,password:'wrong'})})).status,401);
assert.equal((await request('/auth/me',{token})).data.email,email);
const profile = await request('/auth/profile',{token,method:'PUT',body:JSON.stringify({profile:{firstName:'Test',lastName:'Builder',bio:'Saved profile'}})});
assert.equal(profile.data.profile.bio,'Saved profile');
assert.ok(!('passwordHash' in profile.data));
const created=await request('/builds',{token,method:'POST',body:JSON.stringify({name:'Regression build',components:parts,totalCost:1})});
assert.equal(created.status,200,JSON.stringify(created.data));
const id=created.data._id;
const total=Object.values(parts).flat().reduce((sum,p)=>sum+p.price,0);
assert.equal(created.data.totalCost,total);
const loaded=await request('/builds/'+id,{token});
assert.equal(loaded.status,200);
assert.equal(loaded.data.components.storage[0]._id,parts.storage[0]._id);
assert.equal((await request('/builds/'+id)).status,404);
const builds=await request('/builds',{token});
assert.ok(Array.isArray(builds.data));
assert.ok(builds.data.some(b=>b._id===id));
const invalid=await request('/builds',{token,method:'POST',body:JSON.stringify({name:'Invalid',components:{cpu:{_id:'bogus'}}})});
assert.equal(invalid.status,400);
assert.equal((await request('/builds/'+id,{token,method:'DELETE'})).status,200);
assert.equal((await request('/builds/'+id,{token})).status,404);
console.log('PASS: 8 catalogs, registration, normalized login, bad password, session, profile, save/load/list/delete, canonical price, private build access, invalid components.');
