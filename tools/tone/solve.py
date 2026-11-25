# Copied from pcherian89/RevivoPathway tools/tone/solve-pathway.py (commit c95430c), unchanged apart from this line.
"""Solve each Pathway photo's --tone so that, after the shared grade, it lands at the website's set targets
(75th-percentile luminance ~76/255, colour strength ~42%), using the website's own method (tools/tone/measure.py)."""
import sys, json, numpy as np, re
from PIL import Image
def sat_m(s): return np.array([[0.213+0.787*s,0.715-0.715*s,0.072-0.072*s],[0.213-0.213*s,0.715+0.285*s,0.072-0.072*s],[0.213-0.213*s,0.715-0.715*s,0.072+0.928*s]])
def apply(a,chain):
    for f,v in chain:
        if f=='saturate': a=np.clip(a@sat_m(v).T,0,1)
        elif f=='sepia':
            M=np.array([[0.393+0.607*(1-v),0.769-0.769*(1-v),0.189-0.189*(1-v)],[0.349-0.349*(1-v),0.686+0.314*(1-v),0.168-0.168*(1-v)],[0.272-0.272*(1-v),0.534-0.534*(1-v),0.131+0.869*(1-v)]]); a=np.clip(a@M.T,0,1)
        elif f=='contrast': a=np.clip((a-0.5)*v+0.5,0,1)
        elif f=='brightness': a=np.clip(a*v,0,1)
    return a
def parse(t): return [(m[0],float(m[1])) for m in re.findall(r'(saturate|contrast|brightness|sepia)\(([\d.]+)\)',t or '')]
def stats(a):
    L=a@np.array([0.2126,0.7152,0.0722]); mx=a.max(1); mn=a.min(1); S=np.where(mx>0.08,(mx-mn)/np.maximum(mx,1e-6),0)
    return dict(p75=round(np.percentile(L,75)*255,1),p99=round(np.percentile(L,99.5)*255,1),sat=round(S[mx>0.08].mean()*100,1))
GRADE=parse('saturate(0.86) contrast(1.05) brightness(0.92)'); HERO=parse('saturate(0.72) contrast(1.04) brightness(0.86)')
out={}
for path in sys.argv[1:]:
    name=path.split('/')[-1][:-4]; im=Image.open(path).convert('RGB'); im.thumbnail((480,480)); a=np.asarray(im).reshape(-1,3)/255
    base=HERO if 'welcome-hero' in name else GRADE
    s=b=1.0
    for _ in range(8):
        st=stats(apply(a,base+[('saturate',s),('brightness',b)]))
        s=float(np.clip(s*42/st['sat'],0.7,1.2)); b=float(np.clip(b*76/st['p75'],0.75,1.2))
    s,b=round(s,2),round(b,2); st=stats(apply(a,base+[('saturate',s),('brightness',b)]))
    before=stats(apply(a,base)); out[name]=f"saturate({s}) brightness({b})"
    print(name.ljust(24),'graded only:',before,' -> tone',out[name],st)
json.dump(out,open('/dev/stdout','w'),indent=1)
