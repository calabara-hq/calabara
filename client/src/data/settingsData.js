export const settings = [
  {
    heading: 'Profile',
    rows:[
      {
        id: 'name',
        label: 'Name*',
        placeholder: 'Enter your organizations name'
      },
      {
        id: 'website',
        label: 'Website',
        placeholder: 'Enter your organizations website'
      },
      {
        id: 'logo',
        label: 'Logo',
        placeholder: 'Enter your organizations website'
      }
    ]

  },
  {
    heading: 'Admins',
    rows:[
      {
        id: 'addresses',
        label: 'Addresses',
        placeholder: '0x123456789\n0x987654321'
      }

    ]

  },

  {
    heading: 'Gatekeeper',
    rows:[
      {
        id: 'gatekeeperAddress',
        label: 'Address',
        placeholder: '0x6B175474E89094C44Da98b954EedeAC495271d0F'
      },
      {
        id: 'gatekeeperSymbol',
        label: 'Symbol',
        placeholder: 'DAI'
      },
      {
        id: 'gatekeeperDecimal',
        label: 'Decimal',
        placeholder: 18
      },
      {
        id: 'gatekeeperThreshold',
        label: 'Threshold',
        placeholder: 0
      }
    ]

  }
]
