import React, {useEffect, useRef} from "react";
import Jazzicon from "@metamask/jazzicon";

import styled from "@emotion/styled";

const StyledIdenticon = styled.div`
  height: 1.5rem;
  width: 1.5rem;
  border-radius: 1.125rem;
  background-color: black;
`;

export default function Identicon({address}) {
  const ref = useRef();

  useEffect(() => {
    if (address && ref.current) {
      ref.current.innerHTML = "";
      ref.current.appendChild(Jazzicon(16, parseInt(address.slice(2, 10), 16)));
    }
  }, [address]);

  return <StyledIdenticon ref={ref}/>
}