import React, { useEffect, useMemo, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Avatar,
  TextField,
  InputAdornment,
  ToggleButton,
  ToggleButtonGroup,
  Tooltip,
  CircularProgress,
} from "@mui/material";

import {
  PersonAdd as UserCreatedIcon,
  ShoppingCart as PurchaseIcon,
  AddBox as ProductAddedIcon,
  Search as SearchIcon,
} from "@mui/icons-material";

import withLayout from "../../../../layouts/HOC/withLayout";
import { getUserList } from "../../services/mockUserService";

// ---------------------------------------------------------
// Product audit logs
// ---------------------------------------------------------
// Your current project does not have a product audit service,
// so these remain mock events for now.
const productAddedLogs = [
  {
    id: "product-1",
    type: "PRODUCT_ADDED",
    actor: "admin@mankind.com",
    target: "Wireless Headphones",
    detail: "New product added to catalog",
    timestamp: "2025-06-05T08:30:00",
  },
  {
    id: "product-2",
    type: "PRODUCT_ADDED",
    actor: "admin@mankind.com",
    target: "Running Shoes",
    detail: "New product added to catalog",
    timestamp: "2025-06-04T11:00:00",
  },
  {
    id: "product-3",
    type: "PRODUCT_ADDED",
    actor: "admin@mankind.com",
    target: "Smart Watch Pro",
    detail: "New product added to catalog",
    timestamp: "2025-06-03T08:00:00",
  },
];

// ---------------------------------------------------------
// Event configuration
// ---------------------------------------------------------
const typeConfig = {
  USER_CREATED: {
    label: "User Created",
    color: "success",
    icon: <UserCreatedIcon fontSize="small" />,
    bg: "#e8f5e9",
    iconColor: "#4caf50",
  },

  USER_PURCHASE: {
    label: "User Purchase",
    color: "info",
    icon: <PurchaseIcon fontSize="small" />,
    bg: "#e3f2fd",
    iconColor: "#2196f3",
  },

  PRODUCT_ADDED: {
    label: "Product Added",
    color: "warning",
    icon: <ProductAddedIcon fontSize="small" />,
    bg: "#fff3e0",
    iconColor: "#ff9800",
  },
};

// ---------------------------------------------------------
// Date formatter
// ---------------------------------------------------------
const formatDate = (timestamp) => {
  return new Date(timestamp).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

// ---------------------------------------------------------
// Summary Card
// ---------------------------------------------------------
const SummaryCard = ({ type, count }) => {
  const config = typeConfig[type];

  return (
    <Paper
      sx={{
        p: 2.5,
        borderRadius: 3,
        display: "flex",
        alignItems: "center",
        gap: 2,
        flex: 1,
        minWidth: 220,
      }}
    >
      <Box
        sx={{
          width: 48,
          height: 48,
          borderRadius: 2,
          bgcolor: config.bg,
          color: config.iconColor,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {config.icon}
      </Box>

      <Box>
        <Typography variant="h5" sx={{ fontWeight: 700 }}>
          {count}
        </Typography>

        <Typography variant="body2" color="text.secondary">
          {config.label}
        </Typography>
      </Box>
    </Paper>
  );
};

// ---------------------------------------------------------
// Main Audit Logs Page
// ---------------------------------------------------------
const AuditLogsPage = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("ALL");
  const [loading, setLoading] = useState(true);

  // -------------------------------------------------------
  // Get users from existing mock service
  // -------------------------------------------------------
  useEffect(() => {
    const loadUsers = async () => {
      try {
        const userList = await getUserList();
        setUsers(userList || []);
      } catch (error) {
        console.error("Failed to load users:", error);
      } finally {
        setLoading(false);
      }
    };

    loadUsers();
  }, []);

  // -------------------------------------------------------
  // Create audit logs from existing user data
  // -------------------------------------------------------
  const auditLogs = useMemo(() => {
    const userLogs = [];

    users.forEach((user) => {
      // User created event
      if (user.joinDate) {
        userLogs.push({
          id: `user-created-${user.id}`,
          type: "USER_CREATED",
          actor: "System",
          target: user.email,
          detail: "New user registered",
          timestamp: `${user.joinDate}T09:00:00`,
        });
      }

      // Purchase events
      if (user.purchaseHistory?.length) {
        user.purchaseHistory.forEach((purchase) => {
          userLogs.push({
            id: `purchase-${user.id}-${purchase.id}`,
            type: "USER_PURCHASE",
            actor: user.email,
            target: `Order #ORD-${purchase.id}`,
            detail: `Purchased ${purchase.items} item${
              purchase.items !== 1 ? "s" : ""
            } — $${Number(purchase.amount).toFixed(2)}`,
            timestamp: `${purchase.date}T12:00:00`,
          });
        });
      }
    });

    // Combine user events + product events
    return [...userLogs, ...productAddedLogs].sort(
      (a, b) => new Date(b.timestamp) - new Date(a.timestamp),
    );
  }, [users]);

  // -------------------------------------------------------
  // Summary counts
  // -------------------------------------------------------
  const counts = useMemo(() => {
    return {
      USER_CREATED: auditLogs.filter((log) => log.type === "USER_CREATED")
        .length,

      USER_PURCHASE: auditLogs.filter((log) => log.type === "USER_PURCHASE")
        .length,

      PRODUCT_ADDED: auditLogs.filter((log) => log.type === "PRODUCT_ADDED")
        .length,
    };
  }, [auditLogs]);

  // -------------------------------------------------------
  // Search + filter
  // -------------------------------------------------------
  const filteredLogs = useMemo(() => {
    const query = search.trim().toLowerCase();

    return auditLogs.filter((log) => {
      const matchesType = filter === "ALL" || log.type === filter;

      const matchesSearch =
        !query ||
        log.actor.toLowerCase().includes(query) ||
        log.target.toLowerCase().includes(query) ||
        log.detail.toLowerCase().includes(query);

      return matchesType && matchesSearch;
    });
  }, [auditLogs, filter, search]);

  return (
    <Box>
      {/* Page Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5 }}>
          Audit Logs
        </Typography>

        <Typography variant="body1" color="text.secondary">
          Track all key events — user registrations, purchases, and new
          products.
        </Typography>
      </Box>

      {/* Summary Cards */}
      <Box
        sx={{
          display: "flex",
          gap: 3,
          mb: 4,
          flexWrap: "wrap",
        }}
      >
        <SummaryCard type="USER_CREATED" count={counts.USER_CREATED} />

        <SummaryCard type="USER_PURCHASE" count={counts.USER_PURCHASE} />

        <SummaryCard type="PRODUCT_ADDED" count={counts.PRODUCT_ADDED} />
      </Box>

      {/* Audit Log Table */}
      <Paper
        sx={{
          p: 3,
          borderRadius: 3,
        }}
      >
        {/* Filters */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 3,
            flexWrap: "wrap",
            gap: 2,
          }}
        >
          <ToggleButtonGroup
            value={filter}
            exclusive
            onChange={(_, value) => {
              if (value !== null) {
                setFilter(value);
              }
            }}
            size="small"
          >
            <ToggleButton value="ALL">All</ToggleButton>

            <ToggleButton value="USER_CREATED">User Created</ToggleButton>

            <ToggleButton value="USER_PURCHASE">Purchases</ToggleButton>

            <ToggleButton value="PRODUCT_ADDED">Products Added</ToggleButton>
          </ToggleButtonGroup>

          <TextField
            size="small"
            placeholder="Search logs..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" />
                </InputAdornment>
              ),
            }}
            sx={{
              width: 240,
            }}
          />
        </Box>

        {/* Table */}
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                {["Event", "Type", "Actor", "Target / Detail", "Timestamp"].map(
                  (heading) => (
                    <TableCell key={heading} sx={{ fontWeight: 700 }}>
                      {heading}
                    </TableCell>
                  ),
                )}
              </TableRow>
            </TableHead>

            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    <Box
                      sx={{
                        py: 5,
                        display: "flex",
                        justifyContent: "center",
                      }}
                    >
                      <CircularProgress size={28} />
                    </Box>
                  </TableCell>
                </TableRow>
              ) : filteredLogs.length > 0 ? (
                filteredLogs.map((log) => {
                  const config = typeConfig[log.type];

                  return (
                    <TableRow key={log.id} hover>
                      {/* Event Icon */}
                      <TableCell>
                        <Tooltip title={config.label}>
                          <Avatar
                            sx={{
                              width: 36,
                              height: 36,
                              bgcolor: config.bg,
                              color: config.iconColor,
                            }}
                          >
                            {config.icon}
                          </Avatar>
                        </Tooltip>
                      </TableCell>

                      {/* Type */}
                      <TableCell>
                        <Chip
                          label={config.label}
                          color={config.color}
                          size="small"
                        />
                      </TableCell>

                      {/* Actor */}
                      <TableCell>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          {log.actor}
                        </Typography>
                      </TableCell>

                      {/* Target + Detail */}
                      <TableCell>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {log.target}
                        </Typography>

                        <Typography variant="caption" color="text.secondary">
                          {log.detail}
                        </Typography>
                      </TableCell>

                      {/* Timestamp */}
                      <TableCell>
                        <Typography variant="body2" color="text.secondary">
                          {formatDate(log.timestamp)}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ py: 4 }}
                    >
                      No logs found.
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
};

export default withLayout(AuditLogsPage);
