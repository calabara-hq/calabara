import { getSpace } from "../../helpers/snapshot_api";
import React, {useState, useEffect} from 'react';
import { useParams } from 'react-router-dom'



export default function SnapshotConfiguration({ setProgress, setTabHeader }) {
    const { ens } = useParams();
    const [isLoading, setIsLoading] = useState(true)
    const [doesSpaceExist, setDoesSpaceExist] = useState(false)
  
    useEffect(() => {
        setTabHeader('snapshot setup')
    },[])

    setTimeout(() => {
      setIsLoading(false);
    }, 3000)
  
    useEffect(() => {
      (async () => {
        const res = await getSpace(ens);
        console.log(res)
        if (res != null) {
          setDoesSpaceExist(true)
          setIsLoading(false)
        }
      })();
    }, [])
  
  
    return (
      <>
        {!isLoading &&
          <>
            {doesSpaceExist &&
              <div className="tab-message success">
                <p style={{ textAlign: 'center' }}> Successfully found the snapshot space for {ens} &#x1F517;</p>
              </div>
            }
            {!doesSpaceExist &&
              <div className="tab-message error" style={{ width: '60%', textAlign: 'center' }}>
                <p>Couldn't find a space for this ens. To add this widget, a snapshot space with ens {ens} must exist.</p>
              </div>
            }
          </>
        }
        {isLoading &&
          <div className="tab-neutral-message">
            <p>searching for the {ens} snapshot space</p>
          </div>
        }
        <div className='manage-widgets-next-previous-ctr'>
          <button className="previous-btn" onClick={() => { setProgress(0) }}><i class="fas fa-long-arrow-alt-left"></i></button>
          {doesSpaceExist && <button className={"next-btn " + (doesSpaceExist ? 'enable' : 'disabled')} onClick={() => { setProgress(2) }}><i class="fas fa-long-arrow-alt-right"></i></button>}
        </div>
      </>
    )
  }
  