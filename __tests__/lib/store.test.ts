import { useCRMStore } from '@/lib/store'

describe('CRM Store', () => {
  beforeEach(() => {
    // Reset store before each test
    useCRMStore.setState({
      contacts: [],
      deals: [],
      activities: [],
      notes: [],
    })
  })

  it('initializes with empty arrays', () => {
    const state = useCRMStore.getState()
    expect(state.contacts).toEqual([])
    expect(state.deals).toEqual([])
  })

  it('adds a contact', () => {
    const contact = {
      name: 'Test User',
      email: 'test@example.com',
      company: 'Test Company',
      phone: '123-456-7890',
      tags: [],
      value: 0,
    }

    const newContact = useCRMStore.getState().addContact(contact)
    
    expect(newContact.id).toBeDefined()
    expect(newContact.name).toBe('Test User')
    expect(useCRMStore.getState().contacts).toHaveLength(1)
  })

  it('adds a deal', () => {
    const deal = {
      title: 'Test Deal',
      contactId: 'contact-1',
      value: 10000,
      status: 'lead' as const,
      closeDate: new Date().toISOString(),
      tags: [],
    }

    const newDeal = useCRMStore.getState().addDeal(deal)
    
    expect(newDeal.id).toBeDefined()
    expect(newDeal.title).toBe('Test Deal')
    expect(useCRMStore.getState().deals).toHaveLength(1)
  })
})


