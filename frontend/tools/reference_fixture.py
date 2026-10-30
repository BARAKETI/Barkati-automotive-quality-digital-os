"""Independent SciPy/NumPy calculations. Run only when reference fixtures change."""
import json,math
from pathlib import Path
import numpy as np
from scipy import stats,special
root=Path(__file__).resolve().parents[1]
groups=[[10+(j-2)*.001+math.sin(i*1.71+j*.82)*.0005 for j in range(5)] for i in range(25)]
a=np.array(groups);rb=np.ptp(a,axis=1).mean();within=rb/2.326;mean=a.mean();overall=a.std(ddof=1)
ref={'groups':groups,'spc':{'center':float(mean),'within':float(within),'overall':float(overall),'ucl':float(mean+3*within/math.sqrt(5)),'lcl':float(mean-3*within/math.sqrt(5)),'cp':float(.04/(6*within)),'cpk':float(min(10.02-mean,mean-9.98)/(3*within)),'pp':float(.04/(6*overall)),'ppk':float(min(10.02-mean,mean-9.98)/(3*overall))},'t':[{'df':df,'t':t,'p':float(2*stats.t.sf(abs(t),df)),'critical':float(stats.t.ppf(.975,df))} for df in [1,2,5,29,100] for t in [0,.5,2,5]],'binomial':[{'n':n,'c':c,'p':p,'pa':float(stats.binom.cdf(c,n,p))} for n,c,p in [(50,1,.02),(100,3,.05),(1000,10,.01),(100000,50,.001),(10,0,0),(10,10,1),(10,0,1)]],'c4':[{'n':n,'value':float(math.sqrt(2/(n-1))*special.gamma(n/2)/special.gamma((n-1)/2))} for n in [2,5,10,25]]}
v=np.array([10.001+math.sin(i*1.7)*.002 for i in range(30)]);b=v.mean()-10;se=v.std(ddof=1)/math.sqrt(len(v));ref['bias']={'values':v.tolist(),'bias':float(b),'sd':float(v.std(ddof=1)),'p':float(2*stats.t.sf(abs(b/se),29)),'lower':float(b-stats.t.ppf(.975,29)*se),'upper':float(b+stats.t.ppf(.975,29)*se)}
def grr(nested=False):
 rows=[]
 for o in range(3):
  for p in range(10):
   for r in range(2):rows.append({'part':(f'O{o}-' if nested else '')+f'P{p+1}','operator':f'O{o+1}','value':10+p*.012+o*.001+(1 if r else -1)*(.0008+((p+o)%3)*.0002)})
 y=np.array([x['value'] for x in rows]).reshape(3,10,2);gm=y.mean();cm=y.mean(axis=2);om=y.mean(axis=(1,2));mse=np.square(y-cm[:,:,None]).sum()/(3*10*(2-1));mso=10*2*np.square(om-gm).sum()/(3-1)
 if nested:
  msp=2*np.square(cm-om[:,None]).sum()/(3*(10-1));vp=max(0,(msp-mse)/2);vo=max(0,(mso-msp)/20);vi=0
 else:
  pm=y.mean(axis=(0,2));msp=3*2*np.square(pm-gm).sum()/(10-1);msi=2*np.square(cm-pm[None,:]-om[:,None]+gm).sum()/((3-1)*(10-1));vp=max(0,(msp-msi)/6);vo=max(0,(mso-msi)/20);vi=max(0,(msi-mse)/2)
 vg=mse+vo+vi;vt=vg+vp
 return {'rows':rows,'components':{'repeatability':float(mse),'operator':float(vo),'interaction':float(vi),'part':float(vp),'grr':float(vg),'total':float(vt)},'percentStudy':float(100*math.sqrt(vg/vt))}
ref['crossed']=grr();ref['nested']=grr(True)
(root/'fixtures/reference.json').write_text(json.dumps(ref,indent=2))
print('Independent NumPy/SciPy fixture generated.')
