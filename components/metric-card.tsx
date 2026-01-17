import { Card, CardContent, Typography, Box } from "@mui/material";
import type { LucideIcon } from "lucide-react";

interface MetricCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  subtitle?: string;
}

export function MetricCard({
  title,
  value,
  icon: Icon,
  subtitle,
}: MetricCardProps) {
  return (
    <Card
      elevation={0}
      sx={{ border: 1, borderColor: "divider", height: "100%" }}
    >
      <CardContent>
        <Box
          sx={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            mb: 2,
          }}
        >
          <Typography variant="body2" color="text.secondary" fontWeight={500}>
            {title}
          </Typography>
          <Box
            sx={{
              bgcolor: "primary.main",
              color: "primary.contrastText",
              borderRadius: 1,
              p: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Icon size={20} />
          </Box>
        </Box>
        <Typography variant="h4" fontWeight={700} gutterBottom>
          {value}
        </Typography>
        {subtitle && (
          <Typography variant="caption" color="text.secondary">
            {subtitle}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
}
