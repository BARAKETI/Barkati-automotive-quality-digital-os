const test=require('node:test'),assert=require('node:assert/strict'),E=require('../src/engine.js'),M=require('../src/model.js');
test('Synthetic demonstration is valid but not approved',()=>{const c=M.validate(M.demo()),s=E.spc(c.study.groups,{...c.study,...c.spec});assert.equal(E.gate(c,s).status,'HOLD / REVIEW');assert.ok(E.eightDGates(c).every(g=>!g.eligible));});
test('JSON round-trip preserves study and records',()=>{const c=M.demo(),d=M.validate(JSON.parse(JSON.stringify(c)));assert.deepEqual(d,c);assert.deepEqual(E.spc(c.study.groups),E.spc(d.study.groups));});
test('D3 cannot pass with undocumented zero stock',()=>{const c=M.demo();assert.equal(E.eightDGates(c)[2].ready,false);});
test('Accepted cause without test/evidence cannot pass D4',()=>{const c=M.demo();c.causes=['occurrence','escape','systemic'].map((lane,i)=>({id:'C'+i,lane,label:'x',status:'accepted',acceptedBy:'Reviewer',evidenceId:'missing',testId:'missing'}));assert.equal(E.eightDGates(c)[3].ready,false);});
test('Review gates require signed evidence, not status labels alone',()=>{const c=M.demo();c.actions=[{id:'A1',status:'effective'}];assert.equal(E.eightDGates(c)[5].ready,false);});
test('APQP N/A does not bypass a required item',()=>{const c=M.demo();c.deliverables.forEach(r=>Object.assign(r,{status:'Not applicable',owner:'a',reference:'b',approvedBy:'c'}));assert.equal(M.approvalGate(c).complete,0);});
test('Changes invalidate human closure',()=>{const c=M.demo();Object.assign(c.investigation,{approver:'A',approvalReference:'B',closureDate:'2026-10-26'});M.record(c,'change');assert.equal(c.investigation.approver,'');});
test('Duplicate IDs and invalid enums rejected on import',()=>{const c=M.demo();c.risks.push({...c.risks[0]});assert.throws(()=>M.validate(c));const d=M.demo();d.risks[0].domain='Other';assert.throws(()=>M.validate(d));});
test('Impossible containment quantities rejected',()=>{const c=M.demo();c.exposure[0].checked=2;assert.throws(()=>M.validate(c));});
test('Legacy import migrates measurements but no legacy approval booleans',()=>{const c=M.demo(),legacy={schemaVersion:'dqos.case.1.0',state:{specs:{...c.spec,characteristic:'Test',subgroup:5},measurements:c.study.groups.flat(),gates:{approval:true}}};const m=M.migrateV3(legacy);assert.equal(m.governance.reviewer,'');assert.equal(m.study.groups.length,30);});
test('Missing references surfaced',()=>{const c=M.demo();c.risks[1].parentId='absent';assert.ok(M.links(c).length);});
test('Complete synthetic evidence chain enables all eight gates',()=>{const c=require('./happy-case.cjs')();assert.ok(E.eightDGates(c).every(g=>g.eligible));});
test('Incomplete falsification test blocks D4 even if cause is accepted',()=>{const c=require('./happy-case.cjs')();c.tests[0].expectedIfFalse='';assert.equal(E.eightDGates(c)[3].ready,false);});
test('Imported revision cannot inject HTML',()=>{const c=M.demo();c.revision='<img src=x>';assert.throws(()=>M.validate(c));});

test('Malformed optional saved analyses rejected before rendering',()=>{for(const key of ['msaStudies','analyses']){const c=M.demo();c[key]={};assert.throws(()=>M.validate(c));}const c=M.demo();c.msaStudies=[{}];assert.throws(()=>M.validate(c));});
