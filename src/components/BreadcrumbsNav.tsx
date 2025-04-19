import React from 'react';
import { Breadcrumbs, Link, Typography, Paper } from '@mui/material';
import { IconHome, IconChevronRight } from '@tabler/icons';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

interface BreadcrumbItem {
  label: string;
  path?: string;
  icon?: React.ReactNode;
}

interface BreadcrumbsNavProps {
  items: BreadcrumbItem[];
  className?: string;
}

const BreadcrumbsNav: React.FC<BreadcrumbsNavProps> = ({ items, className }) => {
  const navigate = useNavigate();

  return (
    <Paper className={`breadcrumbs-container ${className}`}>
      <Breadcrumbs aria-label="breadcrumb" separator={<IconChevronRight size={16} />}>
        <Link
          color="inherit"
          href="/"
          className="breadcrumb-link"
          onClick={(e) => {
            e.preventDefault();
            navigate('/');
          }}
        >
          <IconHome size={16} />
          <span>Inicio</span>
        </Link>
        
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          
          return isLast ? (
            <Typography key={index} color="text.primary">
              {item.label}
            </Typography>
          ) : (
            <Link
              key={index}
              color="inherit"
              href={item.path || '#'}
              className="breadcrumb-link"
              onClick={(e) => {
                e.preventDefault();
                if (item.path) {
                  navigate(item.path);
                }
              }}
            >
              {item.icon && item.icon}
              <span>{item.label}</span>
            </Link>
          );
        })}
      </Breadcrumbs>
    </Paper>
  );
};

export default styled(BreadcrumbsNav)`
  padding: 12px 16px;
  border-radius: 10px;
  box-shadow: none;
  margin-bottom: 0;

  .breadcrumb-link {
    display: flex;
    align-items: center;
    gap: 8px;
    text-decoration: none;
    padding: 4px 0;
    
    &:hover {
      text-decoration: underline;
    }
  }
`; 