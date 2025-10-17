import React, { useMemo, useState, useEffect } from 'react'
import bank from './questions.json'

const REQUIRED_STREAK = 4

function shuffle(arr){
  const a = arr.slice()
  for(let i=a.length-1;i>0;i--){
    const j = Math.floor(Math.random()*(i+1))
    ;[a[i],a[j]]=[a[j],a[i]]
  }
  return a
}

function prepareQueue(filterDomain){
  const filtered = filterDomain==='all' ? bank : bank.filter(q=>q.domain===filterDomain)
  // initialize per-item state
  return shuffle(filtered).map(q => ({
    ...q, consecutive: 0, seen: 0, wrong: 0, history: []
  }))
}

function Stats({items}){
  const total = items.length
  const mastered = items.filter(i => i.consecutive >= REQUIRED_STREAK).length
  const inplay = total - mastered
  const pct = total ? Math.round(mastered/total*100) : 0
  return (
    <div className="glass" style={{padding:'1rem', borderRadius:20}}>
      <div style={{display:'flex', gap:'1rem', alignItems:'center', justifyContent:'space-between'}}>
        <div>
          <div className="small">Mastery</div>
          <div style={{fontSize:28, fontWeight:700}}>{pct}%</div>
        </div>
        <div style={{flex:1}}>
          <div className="progress"><span style={{width: pct+'%'}}/></div>
        </div>
        <div className="pill">{mastered}/{total} mastered</div>
        <div className="pill">{inplay} in queue</div>
      </div>
    </div>
  )
}

function Controls({domain, setDomain, reset}){
  return (
    <div className="glass" style={{padding:'1rem', borderRadius:20, display:'flex', gap:'.5rem', flexWrap:'wrap'}}>
      <span className="tag">Deck</span>
      <button className={"btn " + (domain==='all'?'primary':'ghost')} onClick={()=>setDomain('all')}>All</button>
      <button className={"btn " + (domain==='signs'?'primary':'ghost')} onClick={()=>setDomain('signs')}>Signs</button>
      <button className={"btn " + (domain==='rules'?'primary':'ghost')} onClick={()=>setDomain('rules')}>Rules</button>
      <div style={{flex:1}}/>
      <button className="btn" onClick={reset}>Reset deck</button>
    </div>
  )
}

function Flashcard({item, onAnswer}){
  const [selection, setSelection] = useState(null)
  const answered = selection !== null

  useEffect(()=>{ setSelection(null) }, [item?.id])

  if(!item) return <div className="glass" style={{padding:'2rem', textAlign:'center'}}>All done. Maybe touch grass?</div>

  return (
    <div className="glass" style={{padding:'1.5rem', borderRadius:24}}>
      <div style={{display:'flex', alignItems:'center', gap:'.5rem', marginBottom:'.5rem'}}>
        <span className="tag">{item.domain}</span>
        <span className="tag">Streak {item.consecutive}/{REQUIRED_STREAK}</span>
        <span className="tag">Seen {item.seen}</span>
        {item.wrong>0 && <span className="tag">Wrong {item.wrong}</span>}
      </div>
      <h2 style={{margin:'0 0 .75rem 0'}}>{item.q}</h2>
      <div>
        {item.choices.map((c,idx)=>{
          const isCorrect = c === item.answer
          const isPicked = selection === idx
          let cls = "answer"
          if(answered){
            if(isCorrect) cls += " correct"
            if(isPicked && !isCorrect) cls += " wrong"
          }
          return (
            <label key={idx} className={cls} onClick={()=>!answered && setSelection(idx)}>
              <input type="radio" name="ans" style={{marginRight:8}} checked={isPicked} readOnly/>
              {c}
            </label>
          )
        })}
      </div>
      {!answered ? (
        <div style={{display:'flex', gap:'.5rem', marginTop:'.5rem'}}>
          <button className="btn primary" onClick={()=>{
            if(selection===null) return
            const picked = item.choices[selection]
            onAnswer(picked === item.answer, picked)
          }}>Check</button>
          <button className="btn ghost" onClick={()=>onAnswer(false, null)}>I don’t know</button>
        </div>
      ) : (
        <div style={{marginTop:'.75rem'}}>
          <div className="small"><strong>Why:</strong> {item.why} <span style={{opacity:.6}}>({item.ref})</span></div>
          <div style={{display:'flex', gap:'.5rem', marginTop:'.5rem'}}>
            <button className="btn primary" onClick={()=>onAnswer(true, item.answer)}>Mark as understood</button>
            <button className="btn" onClick={()=>onAnswer(false, null)}>Re-queue as wrong</button>
          </div>
        </div>
      )}
    </div>
  )
}

export default function App(){
  const [domain, setDomain] = useState('all')
  const [deck, setDeck] = useState(()=>prepareQueue('all'))
  const [current, setCurrent] = useState(0)
  const [completed, setCompleted] = useState(false)

  useEffect(()=>{
    const q = prepareQueue(domain)
    setDeck(q)
    setCurrent(0)
    setCompleted(false)
  }, [domain])

  function handleAnswer(correct){
    setDeck(prev => {
      const arr = prev.slice()
      let item = {...arr[current]}
      item.seen += 1
      if(correct){
        item.consecutive += 1
      }else{
        item.consecutive = 0
        item.wrong += 1
      }
      arr[current] = item

      // If mastered, remove from play in local view by moving it to end but tagged as mastered
      const mastered = item.consecutive >= REQUIRED_STREAK

      // Compute next index and re-queue logic
      // Wrong -> reinsert soon (after 2 cards); Right -> send to end
      const removeIdx = current
      arr.splice(removeIdx,1)
      if(!mastered){
        const insertAt = Math.min(arr.length, current + (correct ? 6 : 2))
        arr.splice(insertAt, 0, item)
      }
      // Move pointer
      let nextIdx = Math.min(current, arr.length-1)
      if(arr.length===0){
        setCompleted(true)
      } else {
        setCurrent(nextIdx)
      }
      return arr
    })
  }

  const masteredCount = deck.filter(d=>d.consecutive>=REQUIRED_STREAK).length
  const total = deck.length
  const inPlay = deck.filter(d=>d.consecutive<REQUIRED_STREAK).length
  const top = deck.find(d=>d.consecutive<REQUIRED_STREAK)

  return (
    <div style={{maxWidth:1100, margin:'0 auto', padding:'1.2rem'}}>
      <header style={{display:'flex', alignItems:'center', gap:'.75rem', margin:'1rem 0'}}>
        <div style={{width:40, height:40, borderRadius:12, background:'linear-gradient(135deg,#4ad0ff33,#7affb333)', border:'1px solid var(--border)'}}/>
        <div>
          <div style={{fontWeight:700, fontSize:20}}>QiAlly • Indiana Driver’s Mastery</div>
          <div className="small">Get each card right <strong>{REQUIRED_STREAK} times</strong> in a row to retire it. Wrong answers cycle back fast.</div>
        </div>
        <div style={{flex:1}}/>
        <a className="btn ghost" href="questions.json" download>Export questions</a>
      </header>

      <div className="grid cols-2">
        <div className="grid" style={{alignContent:'start'}}>
          <Controls domain={domain} setDomain={setDomain} reset={()=>{ setDeck(prepareQueue(domain)); setCurrent(0); setCompleted(False) }}/>
          <Stats items={deck} />
          <Flashcard item={top} onAnswer={handleAnswer} />
          {completed && (
            <div className="glass" style={{padding:'1rem'}}>
              <h3>Deck cleared. DMV boss battle unlocked.</h3>
              <p className="small">Switch domains or reset to grind again.</p>
            </div>
          )}
        </div>
        <aside className="glass" style={{padding:'1rem', borderRadius:24}}>
          <h3 style={{marginTop:0}}>Deck overview</h3>
          <div className="small" style={{marginBottom:'.5rem'}}>Cards left in play: {inPlay}</div>
          <div className="small">Click a tag to filter.</div>
          <div style={{display:'grid', gap:'.5rem', marginTop:'.75rem'}}>
            {deck.map((d,i)=>(
              <div key={d.id} className="glass" style={{padding:'.5rem .75rem', borderRadius:14, border:'1px solid var(--border)'}}>
                <div style={{display:'flex', gap:'.5rem', alignItems:'center'}}>
                  <span className="pill">{d.domain}</span>
                  <span className="pill">Streak {d.consecutive}/{REQUIRED_STREAK}</span>
                  <span className="small" style={{flex:1, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis'}}>{d.q}</span>
                </div>
              </div>
            ))}
          </div>
          <div style={{marginTop:'1rem'}} className="small">
            <p><strong>Editing:</strong> Open <code>src/questions.json</code> to add more questions. Each item has fields: <code>q, choices[], answer, domain, ref, why</code>.</p>
            <p>Domains supported: <code>signs</code>, <code>rules</code> (add more if you like).</p>
          </div>
        </aside>
      </div>
    </div>
  )
}