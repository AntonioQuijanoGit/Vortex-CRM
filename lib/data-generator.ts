import { faker } from "@faker-js/faker";
import type { Contact, Deal, Activity, Note } from "./types";
import { DEAL_STATUSES, CONTACT_STATUSES, DEFAULT_TAGS, STORAGE_KEYS, DATA_VERSION } from "./constants";

export function generateAvatar(name: string): string {
  return `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name)}`;
}

export function generateContact(): Contact {
  const name = faker.person.fullName();
  const createdAt = faker.date.past({ years: 1 }).toISOString();
  
  return {
    id: faker.string.uuid(),
    name,
    email: faker.internet.email({ firstName: name.split(" ")[0], lastName: name.split(" ")[1] }),
    phone: faker.phone.number(),
    company: faker.company.name(),
    position: faker.person.jobTitle(),
    avatar: "",
    value: faker.number.int({ min: 1000, max: 100000 }),
    status: faker.helpers.arrayElement(["active", "inactive", "lead"] as const),
    tags: faker.helpers.arrayElements(DEFAULT_TAGS, { min: 0, max: 3 }),
    notes: faker.helpers.maybe(() => faker.lorem.sentence(), { probability: 0.3 }) || "",
    createdAt,
    updatedAt: createdAt,
  };
}

export function generateDeal(contactId: string, status?: Deal["status"]): Deal {
  const createdAt = faker.date.past({ years: 0.25 }).toISOString();
  const dealStatus = status || faker.helpers.arrayElement(DEAL_STATUSES.map(s => s.value)) as Deal["status"];
  
  // Generate close date based on status - won/lost deals should be in the past
  const closeDate = dealStatus === "won" || dealStatus === "lost"
    ? faker.date.between({ from: new Date(createdAt), to: new Date() }).toISOString()
    : faker.date.future({ years: 0.25 }).toISOString();
  
  // More realistic deal titles with company context
  const dealTemplates = [
    "Enterprise Software License",
    "Annual Service Agreement",
    "Custom Development Project",
    "Platform Integration Services",
    "Professional Services Package",
    "Training and Certification Program",
    "Support and Maintenance Renewal",
    "Cloud Infrastructure Migration",
    "Digital Transformation Initiative",
    "Security and Compliance Package",
    "Data Analytics Platform",
    "AI/ML Implementation Services",
  ];
  
  const title = faker.helpers.arrayElement(dealTemplates);
  
  // Probability should correlate with status
  const getProbability = (s: Deal["status"]): number => {
    switch (s) {
      case "won": return faker.number.int({ min: 90, max: 100 });
      case "lost": return faker.number.int({ min: 0, max: 20 });
      case "negotiation": return faker.number.int({ min: 70, max: 90 });
      case "proposal": return faker.number.int({ min: 50, max: 70 });
      case "contacted": return faker.number.int({ min: 30, max: 50 });
      default: return faker.number.int({ min: 10, max: 30 });
    }
  };
  
  return {
    id: faker.string.uuid(),
    title,
    contactId,
    value: faker.number.int({ min: 5000, max: 250000 }),
    status: dealStatus,
    probability: getProbability(dealStatus),
    closeDate,
    notes: faker.helpers.maybe(() => faker.lorem.sentences({ min: 2, max: 4 }), { probability: 0.5 }) || "",
    tags: faker.helpers.arrayElements(DEFAULT_TAGS, { min: 0, max: 3 }),
    createdAt,
    updatedAt: createdAt,
  };
}

export function generateActivity(
  type: Activity["type"],
  contactId?: string,
  dealId?: string,
  contactName?: string,
  dealTitle?: string
): Activity {
  // More contextual and varied activity descriptions
  const getDescription = (): string => {
    switch (type) {
      case "contact_created":
        return `New contact ${contactName ? `"${contactName}"` : ""} was added to the CRM`;
      case "deal_created":
        return dealTitle 
          ? `Deal "${dealTitle}" was created`
          : "New deal was created";
      case "deal_moved":
        return dealTitle
          ? `Deal "${dealTitle}" status was updated`
          : "Deal status was updated";
      case "deal_won":
        return dealTitle
          ? `Deal "${dealTitle}" was successfully closed`
          : "Deal was won";
      case "deal_lost":
        return dealTitle
          ? `Deal "${dealTitle}" was marked as lost`
          : "Deal was lost";
      case "note_added":
        return contactName
          ? `Note was added to contact "${contactName}"`
          : "Note was added";
      case "contact_updated":
        return contactName
          ? `Contact "${contactName}" information was updated`
          : "Contact was updated";
      default:
        return "Activity was logged";
    }
  };

  return {
    id: faker.string.uuid(),
    type,
    contactId,
    dealId,
    description: getDescription(),
    createdAt: faker.date.recent({ days: 30 }).toISOString(),
  };
}

export function generateNote(contactId?: string, dealId?: string): Note {
  // More realistic note content templates
  const noteTemplates = [
    "Discussed pricing and contract terms. Follow up scheduled for next week.",
    "Client expressed interest in premium features. Send detailed proposal.",
    "Initial discovery call completed. Requirements gathered, moving to proposal stage.",
    "Follow-up meeting scheduled. Need to address technical concerns.",
    "Contract negotiation in progress. Terms being finalized.",
    "Decision maker identified. Presentation scheduled for next month.",
    "Technical questions answered. Waiting for budget approval.",
    "Demo completed successfully. Client requested pricing information.",
    "Competitive analysis shared. Emphasized our unique value proposition.",
    "Implementation timeline discussed. Planning next steps.",
  ];
  
  const content = faker.helpers.maybe(
    () => faker.helpers.arrayElement(noteTemplates),
    { probability: 0.4 }
  ) || faker.lorem.paragraphs({ min: 1, max: 2 });
  
  const createdAt = faker.date.recent({ days: 60 }).toISOString();
  
  return {
    id: faker.string.uuid(),
    contactId,
    dealId,
    content,
    createdAt,
    updatedAt: faker.helpers.maybe(
      () => faker.date.between({ from: new Date(createdAt), to: new Date() }).toISOString(),
      { probability: 0.2 }
    ) || createdAt,
  };
}

export function generateSeedData() {
  const contacts: Contact[] = [];
  const deals: Deal[] = [];
  const activities: Activity[] = [];
  const notes: Note[] = [];

  // Generate 100 contacts with more realistic distribution
  for (let i = 0; i < 100; i++) {
    const contact = generateContact();
    contacts.push(contact);
    
    // Add contact creation activity with name
    activities.push(generateActivity("contact_created", contact.id, undefined, contact.name));
    
    // 60% chance of having notes
    if (faker.datatype.boolean({ probability: 0.6 })) {
      notes.push(generateNote(contact.id));
    }
  }

  // Generate 60 deals with more realistic status distribution
  // Better distribution: more in early stages, fewer won/lost
  const statusWeights = [
    { status: "lead" as const, weight: 0.25 },
    { status: "contacted" as const, weight: 0.30 },
    { status: "proposal" as const, weight: 0.20 },
    { status: "negotiation" as const, weight: 0.15 },
    { status: "won" as const, weight: 0.07 },
    { status: "lost" as const, weight: 0.03 },
  ];
  
  const dealCount = 60;
  for (let i = 0; i < dealCount; i++) {
    const contact = faker.helpers.arrayElement(contacts);
    
    // Select status based on weights
    const random = Math.random();
    let cumulativeWeight = 0;
    let selectedStatus: Deal["status"] = "lead";
    for (const { status, weight } of statusWeights) {
      cumulativeWeight += weight;
      if (random <= cumulativeWeight) {
        selectedStatus = status;
        break;
      }
    }
    
    const deal = generateDeal(contact.id, selectedStatus);
    deals.push(deal);
    
    // Add deal creation activity with names
    activities.push(generateActivity("deal_created", contact.id, deal.id, contact.name, deal.title));
    
    // Add deal status change activities with context
    if (deal.status === "won") {
      activities.push(generateActivity("deal_won", contact.id, deal.id, contact.name, deal.title));
    } else if (deal.status === "lost") {
      activities.push(generateActivity("deal_lost", contact.id, deal.id, contact.name, deal.title));
    } else {
      // Add some deal movement activities for active deals
      if (faker.datatype.boolean({ probability: 0.3 })) {
        activities.push(generateActivity("deal_moved", contact.id, deal.id, contact.name, deal.title));
      }
    }
    
    // 50% chance of having notes for deals
    if (faker.datatype.boolean({ probability: 0.5 })) {
      notes.push(generateNote(contact.id, deal.id));
    }
  }

  // Generate additional random activities with context
  for (let i = 0; i < 50; i++) {
    const contact = faker.helpers.arrayElement(contacts);
    const deal = faker.helpers.maybe(() => faker.helpers.arrayElement(deals), { probability: 0.4 });
    
    const type = faker.helpers.arrayElement([
      "note_added",
      "contact_updated",
      "deal_moved",
    ] as Activity["type"][]);
    
    activities.push(generateActivity(
      type,
      contact.id,
      deal?.id,
      contact.name,
      deal?.title
    ));
  }

  return {
    contacts,
    deals,
    activities,
    notes,
  };
}

export function seedDataIfNeeded() {
  if (typeof window === "undefined") return;

  try {
    const currentVersion = localStorage.getItem(STORAGE_KEYS.DATA_VERSION);
    const hasContacts = localStorage.getItem(STORAGE_KEYS.CONTACTS);
    
    // If version changed or no data exists, regenerate
    if (currentVersion !== DATA_VERSION || !hasContacts) {
      // Clear old data if version changed
      if (currentVersion && currentVersion !== DATA_VERSION) {
        localStorage.removeItem(STORAGE_KEYS.CONTACTS);
        localStorage.removeItem(STORAGE_KEYS.DEALS);
        localStorage.removeItem(STORAGE_KEYS.ACTIVITIES);
        localStorage.removeItem(STORAGE_KEYS.NOTES);
      }

      const data = generateSeedData();
      
      localStorage.setItem(STORAGE_KEYS.CONTACTS, JSON.stringify(data.contacts));
      localStorage.setItem(STORAGE_KEYS.DEALS, JSON.stringify(data.deals));
      localStorage.setItem(STORAGE_KEYS.ACTIVITIES, JSON.stringify(data.activities));
      localStorage.setItem(STORAGE_KEYS.NOTES, JSON.stringify(data.notes));
      localStorage.setItem(STORAGE_KEYS.DATA_VERSION, DATA_VERSION);
      
      console.log(`✅ Generated seed data: ${data.contacts.length} contacts, ${data.deals.length} deals`);
    }
  } catch (error) {
    console.error("Error in seedDataIfNeeded:", error);
    // Don't throw - allow app to continue
  }
  
  // Initialize settings if not present
  if (!localStorage.getItem(STORAGE_KEYS.SETTINGS)) {
    const defaultSettings = {
      theme: "dark" as const,
      currency: "USD",
      dateFormat: "MMM dd, yyyy",
      notifications: true,
    };
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(defaultSettings));
  }
}

