# Portal Matecitos - Invoice Management System

## Description
Web application for managing invoices, built with React. Allows tracking of both received and emitted invoices, with features for filtering, viewing details, and managing payment statuses.

## Technical Implementation Details

### State Management
```javascript
// Main state hooks
const [activeTab, setActiveTab] = useState('received');
const [showModal, setShowModal] = useState(false);
const [dateFilter, setDateFilter] = useState({ startDate: '', endDate: '' });
const [searchTerm, setSearchTerm] = useState('');
const [selectedInvoice, setSelectedInvoice] = useState(null);
const [editingInvoice, setEditingInvoice] = useState(null);
const [deleteConfirmation, setDeleteConfirmation] = useState(null);
```

## Development Guide

### Project Structure
